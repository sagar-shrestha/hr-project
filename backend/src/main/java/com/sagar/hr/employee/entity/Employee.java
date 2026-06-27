package com.sagar.hr.employee.entity;

import com.sagar.hr.department.model.Department;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "citizenship_number"),
    @UniqueConstraint(columnNames = "pan_number"),
    @UniqueConstraint(columnNames = "employee_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_nepali")
    private String nameNepali;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "citizenship_number", unique = true)
    private String citizenshipNumber;

    @Column(name = "pan_number", unique = true)
    private String panNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", referencedColumnName = "id")
    private Department department;

    private String designation;

    @Column(name = "employee_code", unique = true)
    private String employeeCode;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "date_of_birth_bs", length = 10)
    private String dateOfBirthBS;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "join_date_bs", length = 10)
    private String joinDateBS;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
