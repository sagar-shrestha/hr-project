package com.sagar.hr.security.services;

import com.sagar.hr.security.dto.request.SignupRequest;
import com.sagar.hr.security.dto.response.UserResponse;
import com.sagar.hr.security.mapper.UserMapper;
import com.sagar.hr.security.model.Role;
import com.sagar.hr.security.model.User;
import com.sagar.hr.security.repository.UserRepository;
import com.sagar.hr.security.repository.RoleRepository;
import com.sagar.hr.util.exception.AlreadyInUseException;
import com.sagar.hr.util.exception.NotAbleToAssignException;
import com.sagar.hr.util.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final UserMapper userMapper;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse createUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new AlreadyInUseException("Username is already taken: " + signUpRequest.getUsername());
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AlreadyInUseException("Email is already in use: " + signUpRequest.getEmail());
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new NotFoundException("Role ROLE_USER not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new NotAbleToAssignException("Cannot create or assign SUPER_ADMIN role!");
            }
            strRoles.forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new NotFoundException("Role " + role + " not found."));
                roles.add(foundRole);
            });
        }

        validateCanManageTargetRoles(roles);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    public UserResponse updateUserRoles(Long userId, Set<String> strRoles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new NotFoundException("Role ROLE_USER not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new NotAbleToAssignException("Cannot create or assign SUPER_ADMIN role!");
            }
            strRoles.forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new NotFoundException("Role " + role + " not found."));
                roles.add(foundRole);
            });
        }

        validateCanManageTargetUser(user);
        validateCanManageTargetRoles(roles);

        user.setRoles(roles);
        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        validateCanManageTargetUser(user);
        userRepository.delete(user);
    }

    private void validateCanManageTargetUser(User targetUser) {
        validateCanManageTargetRoles(targetUser.getRoles());
    }

    private void validateCanManageTargetRoles(Set<Role> targetRoles) {
        String currentUserRole = getCurrentUserHighestRole();

        boolean isAdmin = currentUserRole.equals("ROLE_ADMIN");
        boolean isModerator = currentUserRole.equals("ROLE_MODERATOR");

        for (Role role : targetRoles) {
            String roleName = role.getName();
            if (isModerator) {
                if (!roleName.equals("ROLE_USER")) {
                    throw new NotAbleToAssignException("Moderator can only manage Users!");
                }
            } else if (isAdmin) {
                if (roleName.equals("ROLE_ADMIN") || roleName.equals("ROLE_SUPER_ADMIN")) {
                    throw new NotAbleToAssignException("Admin cannot manage Admins or Super Admins!");
                }
            }
        }
    }

    private String getCurrentUserHighestRole() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetailsImpl)) {
            throw new NotFoundException("Invalid authentication principal!");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        Set<String> actualRoles = userDetails.getRoles();

        if (actualRoles.contains("ROLE_SUPER_ADMIN"))
            return "ROLE_SUPER_ADMIN";
        if (actualRoles.contains("ROLE_ADMIN"))
            return "ROLE_ADMIN";
        if (actualRoles.contains("ROLE_MODERATOR"))
            return "ROLE_MODERATOR";
        return "ROLE_USER";
    }
}
