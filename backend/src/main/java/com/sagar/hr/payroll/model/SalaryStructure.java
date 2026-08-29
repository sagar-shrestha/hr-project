package com.sagar.hr.payroll.model;

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
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class SalaryStructure extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal basicSalary;

    @Column(nullable = false)
    private BigDecimal allowances;

    @Column(nullable = false)
    private BigDecimal deductions;

    @Column(nullable = false)
    private BigDecimal taxRate;

    private Long employeeId;

    private LocalDateTime effectiveFrom;

    private LocalDateTime effectiveTo;

    public BigDecimal getNetSalary() {
        BigDecimal gross = basicSalary.add(allowances);
        BigDecimal tax = gross.multiply(taxRate);
        return gross.subtract(tax).subtract(deductions);
    }
}
