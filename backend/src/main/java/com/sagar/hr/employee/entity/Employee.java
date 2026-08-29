package com.sagar.hr.employee.entity;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.util.audit.AuditableEntity;
import com.sagar.hr.util.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

import java.time.LocalDate;

@Entity
@Table(name = "employees", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "citizenship_number"),
        @UniqueConstraint(columnNames = "pan_number"),
        @UniqueConstraint(columnNames = "employee_code")
})
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class Employee extends AuditableEntity {

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
    @JoinColumn(name = "department_id", foreignKey = @ForeignKey(name = "fk_employee_department_id"), referencedColumnName = "id")
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;
}
