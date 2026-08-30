package com.sagar.hr.usermanagement.service;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.department.repository.DepartmentRepository;
import com.sagar.hr.employee.entity.User;
import com.sagar.hr.employee.repository.EmployeeRepository;
import com.sagar.hr.security.dto.request.SignupRequest;
import com.sagar.hr.security.model.Role;
import com.sagar.hr.security.services.UserDetailsImpl;
import com.sagar.hr.usermanagement.dto.request.CreateUserRequest;
import com.sagar.hr.usermanagement.dto.request.EmployeeProfileRequest;
import com.sagar.hr.usermanagement.dto.request.UpdateUserRequest;
import com.sagar.hr.usermanagement.dto.response.UserResponse;
import com.sagar.hr.usermanagement.mapper.UserMapper;
import com.sagar.hr.util.exception.AlreadyInUseException;
import com.sagar.hr.util.exception.NotAbleToAssignException;
import com.sagar.hr.util.exception.NotFoundException;
import com.sagar.hr.util.enums.Status;
import com.sagar.hr.security.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final UserMapper userMapper;
    private final DepartmentRepository departmentRepository;

    public List<UserResponse> getAllUsers() {
        return employeeRepository.findAll().stream()
                .filter(User.class::isInstance)
                .map(User.class::cast)
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = employeeRepository.findUserById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = employeeRepository.findUserById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        if (!user.getUsername().equals(request.getUsername()) && employeeRepository.existsByUsername(request.getUsername())) {
            throw new AlreadyInUseException("Username is already taken: " + request.getUsername());
        }

        if (!user.getEmail().equals(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new AlreadyInUseException("Email is already in use: " + request.getEmail());
        }

        validateCanManageTargetUser(user);

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(encoder.encode(request.getPassword()));
        }

        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new NotFoundException("Role ROLE_USER not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new NotAbleToAssignException("Cannot assign SUPER_ADMIN role!");
            }
            strRoles.forEach(role -> {
                Role foundRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new NotFoundException("Role " + role + " not found."));
                roles.add(foundRole);
            });
        }

        validateCanManageTargetRoles(roles);
        user.setRoles(roles);

        if (request.getEmployeeProfile() != null) {
            updateEmployeeFields(user, request.getEmployeeProfile());
        }

        User saved = employeeRepository.save(user);
        log.info("User updated with id: {}", saved.getId());
        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new AlreadyInUseException("Username is already taken: " + request.getUsername());
        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new AlreadyInUseException("Email is already in use: " + request.getEmail());
        }

        Set<String> strRoles = request.getRoles();
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

        User savedUser;
        EmployeeProfileRequest profile = request.getEmployeeProfile();

        if (profile != null) {
            User user = buildUserFromProfile(request.getUsername(), request.getEmail(),
                    encoder.encode(request.getPassword()), profile);
            user.setRoles(roles);

            Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseThrow(() -> new NotFoundException("Role ROLE_EMPLOYEE not found."));
            user.getRoles().add(employeeRole);

            savedUser = employeeRepository.save(user);
            log.info("Employee account created with id: {}", savedUser.getId());
        } else {
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(encoder.encode(request.getPassword()))
                    .active(true)
                    .build();
            user.setRoles(roles);
            savedUser = employeeRepository.save(user);
            log.info("User created with id: {}", savedUser.getId());
        }

        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse createUserFromSignup(SignupRequest signUpRequest) {
        if (employeeRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new AlreadyInUseException("Username is already taken: " + signUpRequest.getUsername());
        }

        if (employeeRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AlreadyInUseException("Email is already in use: " + signUpRequest.getEmail());
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .active(true)
                .build();

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
        User savedUser = employeeRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public UserResponse updateUserRoles(Long userId, Set<String> strRoles) {
        User user = employeeRepository.findUserById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new NotFoundException("Role ROLE_USER not found."));
            roles.add(userRole);
        } else {
            if (strRoles.contains("ROLE_SUPER_ADMIN")) {
                throw new NotAbleToAssignException("Cannot assign SUPER_ADMIN role!");
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
        User updatedUser = employeeRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = employeeRepository.findUserById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        validateCanManageTargetUser(user);
        employeeRepository.delete(user);
    }

    private void updateEmployeeFields(User user, EmployeeProfileRequest profile) {
        if (profile.getName() != null) user.setName(profile.getName());
        if (profile.getNameNepali() != null) user.setNameNepali(profile.getNameNepali());
        if (profile.getPhone() != null) user.setPhone(profile.getPhone());
        if (profile.getCitizenshipNumber() != null) user.setCitizenshipNumber(profile.getCitizenshipNumber());
        if (profile.getPanNumber() != null) user.setPanNumber(profile.getPanNumber());
        if (profile.getDepartmentId() != null) {
            user.setDepartment(resolveDepartment(profile.getDepartmentId()));
        }
        if (profile.getDesignation() != null) user.setDesignation(profile.getDesignation());
        if (profile.getEmployeeCode() != null) user.setEmployeeCode(profile.getEmployeeCode());
        if (profile.getDateOfBirth() != null) user.setDateOfBirth(profile.getDateOfBirth());
        if (profile.getDateOfBirthBS() != null) user.setDateOfBirthBS(profile.getDateOfBirthBS());
        if (profile.getJoinDate() != null) user.setJoinDate(profile.getJoinDate());
        if (profile.getJoinDateBS() != null) user.setJoinDateBS(profile.getJoinDateBS());
    }

    private User buildUserFromProfile(String username, String email, String encodedPassword,
                                       EmployeeProfileRequest profile) {
        Department department = resolveDepartment(profile.getDepartmentId());
        return User.builder()
                .username(username)
                .email(email)
                .password(encodedPassword)
                .name(profile.getName())
                .nameNepali(profile.getNameNepali())
                .phone(profile.getPhone())
                .citizenshipNumber(profile.getCitizenshipNumber())
                .panNumber(profile.getPanNumber())
                .nidNumber(profile.getNidNumber())
                .department(department)
                .designation(profile.getDesignation())
                .employeeCode(profile.getEmployeeCode())
                .dateOfBirth(profile.getDateOfBirth())
                .dateOfBirthBS(profile.getDateOfBirthBS())
                .joinDate(profile.getJoinDate())
                .joinDateBS(profile.getJoinDateBS())
                .status(Status.ACTIVE)
                .active(true)
                .build();
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) return null;
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new NotFoundException("Department not found with id: " + departmentId));
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

        if (!(principal instanceof UserDetailsImpl userDetails)) {
            throw new NotFoundException("Invalid authentication principal!");
        }

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
