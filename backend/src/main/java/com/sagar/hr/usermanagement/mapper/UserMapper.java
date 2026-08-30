package com.sagar.hr.usermanagement.mapper;

import com.sagar.hr.employee.entity.User;
import com.sagar.hr.security.model.Role;
import com.sagar.hr.usermanagement.dto.response.EmployeeProfileResponse;
import com.sagar.hr.usermanagement.dto.response.UserResponse;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        boolean isEmployee = user.getName() != null;

        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .isEmployee(isEmployee);

        if (isEmployee) {
            builder.employeeProfile(buildEmployeeProfile(user));
        }

        return builder.build();
    }

    private EmployeeProfileResponse buildEmployeeProfile(User user) {
        return EmployeeProfileResponse.builder()
                .name(user.getName())
                .nameNepali(user.getNameNepali())
                .phone(user.getPhone())
                .citizenshipNumber(user.getCitizenshipNumber())
                .panNumber(user.getPanNumber())
                .nidNumber(user.getNidNumber())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .designation(user.getDesignation())
                .employeeCode(user.getEmployeeCode())
                .dateOfBirth(user.getDateOfBirth())
                .dateOfBirthBS(user.getDateOfBirthBS())
                .joinDate(user.getJoinDate())
                .joinDateBS(user.getJoinDateBS())
                .build();
    }
}
