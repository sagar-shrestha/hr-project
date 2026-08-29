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
import java.time.LocalTime;

@Entity
@Table(name = "shifts")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class Shift extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "late_threshold_minutes")
    private Integer lateThresholdMinutes = 15;

    @Column(name = "night_shift")
    private Boolean nightShift = false;

    @Column(name = "night_shift_allowance", precision = 12, scale = 2)
    private BigDecimal nightShiftAllowance = BigDecimal.ZERO;
}
