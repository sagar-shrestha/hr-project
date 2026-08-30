package com.sagar.hr.usermanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeProfileRequest {

    private String name;

    private String nameNepali;

    private String phone;

    private String citizenshipNumber;

    private String panNumber;

    private String nidNumber;

    private Long departmentId;

    private String designation;

    private String employeeCode;

    private LocalDate dateOfBirth;

    private String dateOfBirthBS;

    private LocalDate joinDate;

    private String joinDateBS;
}
