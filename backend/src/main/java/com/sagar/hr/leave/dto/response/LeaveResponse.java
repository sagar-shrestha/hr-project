package com.sagar.hr.leave.dto.response;

import com.sagar.hr.leave.entity.LeaveStatus;
import com.sagar.hr.leave.entity.LeaveType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private Long id;
    private Long userId;
    private String username;
    private LeaveType leaveType;
    private LeaveStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private Integer totalDays;
    private Long approvedById;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectedReason;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
