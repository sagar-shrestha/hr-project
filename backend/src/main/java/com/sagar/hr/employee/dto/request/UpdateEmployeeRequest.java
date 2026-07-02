package com.sagar.hr.employee.dto.request;

import jakarta.validation.constraints.Email;
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
public class UpdateEmployeeRequest {

    private String name;

    private String nameNepali;

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

    private String status;
}
