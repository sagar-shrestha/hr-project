package com.sagar.hr.employee.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {

    @NotBlank
    private String name;

    private String nameNepali;

    @NotBlank
    @Email
    private String email;

    private String phone;

    private String citizenshipNumber;

    private String panNumber;

    private Long departmentId;

    private String designation;

    private String employeeCode;

    private LocalDate dateOfBirth;

    private String dateOfBirthBS;

    private LocalDate joinDate;

    private String joinDateBS;
}
