package com.sagar.hr.leave.entity;

import com.sagar.hr.security.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "leave_type", "year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 20)
    private LeaveType leaveType;

    @Column(name = "total_days", nullable = false, precision = 6, scale = 1)
    private BigDecimal totalDays = BigDecimal.ZERO;

    @Column(name = "used_days", nullable = false, precision = 6, scale = 1)
    private BigDecimal usedDays = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer year;
}
