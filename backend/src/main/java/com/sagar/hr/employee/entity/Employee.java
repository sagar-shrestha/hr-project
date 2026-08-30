package com.sagar.hr.employee.entity;

import com.sagar.hr.department.model.Department;
import com.sagar.hr.util.audit.AuditableEntity;
import com.sagar.hr.util.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.envers.Audited;

import java.time.LocalDate;

/**
 * Root of the {@code users} SINGLE_TABLE hierarchy.
 *
 * Holds the primary key and the HR profile fields. A row with
 * {@code user_type = 'EMPLOYEE'} is instantiated as this class directly and
 * carries profile-only data. {@link User} extends this class to add the login
 * fields ({@code username}/{@code email}/{@code password}/{@code roles}).
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@DiscriminatorValue("EMPLOYEE")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Audited
public class Employee extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_nepali")
    private String nameNepali;

    private String phone;

    @Column(name = "citizenship_number")
    private String citizenshipNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "nid_number")
    private String nidNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", foreignKey = @ForeignKey(name = "fk_user_department_id"), referencedColumnName = "id")
    private Department department;

    private String designation;

    @Column(name = "employee_code")
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
