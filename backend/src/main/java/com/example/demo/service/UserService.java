package com.example.demo.service;

import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.auth.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse createUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new RuntimeException("Error: Cannot create or assign SUPER_ADMIN role!");
            }
            strRoles.forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + role + " is not found."));
                roles.add(foundRole);
            });
        }

        validateCanManageTargetRoles(roles);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    public UserResponse updateUserRoles(Long userId, Set<String> strRoles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new RuntimeException("Error: Cannot create or assign SUPER_ADMIN role!");
            }
            strRoles.forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + role + " is not found."));
                roles.add(foundRole);
            });
        }

        validateCanManageTargetUser(user);
        validateCanManageTargetRoles(roles);

        user.setRoles(roles);
        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        validateCanManageTargetUser(user);
        userRepository.delete(user);
    }

    private void validateCanManageTargetUser(User targetUser) {
        Set<Role> targetRoles = targetUser.getRoles();
        validateCanManageTargetRoles(targetRoles);
    }

    private void validateCanManageTargetRoles(Set<Role> targetRoles) {
        String currentUserRole = getCurrentUserHighestRole();

        boolean isAdmin = currentUserRole.equals("ROLE_ADMIN");
        boolean isModerator = currentUserRole.equals("ROLE_MODERATOR");

        for (Role role : targetRoles) {
            String roleName = role.getName();
            if (isModerator) {
                // Moderator can ONLY manage ROLE_USER
                if (!roleName.equals("ROLE_USER")) {
                    throw new RuntimeException("Error: Moderator can only manage Users!");
                }
            } else if (isAdmin) {
                // Admin can manage ROLE_MODERATOR and ROLE_USER
                if (roleName.equals("ROLE_ADMIN") || roleName.equals("ROLE_SUPER_ADMIN")) {
                    throw new RuntimeException("Error: Admin cannot manage Admins or Super Admins!");
                }
            }
            // Super Admin can manage anyone
        }
    }

    private String getCurrentUserHighestRole() {
        // Get the UserDetailsImpl from the authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof com.example.demo.security.services.UserDetailsImpl)) {
            throw new RuntimeException("Error: Invalid authentication principal!");
        }

        com.example.demo.security.services.UserDetailsImpl userDetails = (com.example.demo.security.services.UserDetailsImpl) principal;

        // Get actual assigned roles (not inherited from hierarchy)
        Set<String> actualRoles = userDetails.getRoles();

        // Return the highest role based on priority
        if (actualRoles.contains("ROLE_SUPER_ADMIN"))
            return "ROLE_SUPER_ADMIN";
        if (actualRoles.contains("ROLE_ADMIN"))
            return "ROLE_ADMIN";
        if (actualRoles.contains("ROLE_MODERATOR"))
            return "ROLE_MODERATOR";
        return "ROLE_USER";
    }

    private UserResponse convertToResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), roles);
    }
}
