package com.sagar.hr.attendance.entity;

import com.sagar.hr.util.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "overtime_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "date"})
})
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class OvertimeRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "regular_hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal regularHours;

    @Column(name = "overtime_hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal overtimeHours = BigDecimal.ZERO;

    @Column(name = "overtime_rate", nullable = false, precision = 3, scale = 2)
    private BigDecimal overtimeRate = new BigDecimal("1.50");

    @Column(name = "overtime_amount", precision = 12, scale = 2)
    private BigDecimal overtimeAmount;

    @Column(nullable = false)
    private Boolean approved = false;
}
