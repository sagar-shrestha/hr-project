package com.sagar.hr.usermanagement.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private boolean isEmployee;

    private EmployeeProfileResponse employeeProfile;
}
