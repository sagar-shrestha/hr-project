package com.sagar.hr.leave.dto.response;

import com.sagar.hr.leave.entity.LeaveType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceResponse {
    private LeaveType leaveType;
    private BigDecimal totalDays;
    private BigDecimal usedDays;
    private BigDecimal remainingDays;
}
