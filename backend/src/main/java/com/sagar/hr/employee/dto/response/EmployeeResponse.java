package com.sagar.hr.employee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String name;
    private String nameNepali;
    private String email;
    private String phone;
    private String citizenshipNumber;
    private String panNumber;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String employeeCode;
    private LocalDate dateOfBirth;
    private String dateOfBirthBS;
    private LocalDate joinDate;
    private String joinDateBS;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
