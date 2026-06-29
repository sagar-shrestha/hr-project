package com.sagar.hr.leave.mapper;

import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;
import com.sagar.hr.leave.entity.LeaveBalance;
import com.sagar.hr.leave.entity.LeaveRequest;
import org.springframework.stereotype.Component;

@Component
public class LeaveMapper {

    public LeaveResponse toResponse(LeaveRequest leaveRequest) {
        return LeaveResponse.builder()
                .id(leaveRequest.getId())
                .userId(leaveRequest.getUser().getId())
                .username(leaveRequest.getUser().getUsername())
                .leaveType(leaveRequest.getLeaveType())
                .status(leaveRequest.getStatus())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .reason(leaveRequest.getReason())
                .totalDays(leaveRequest.getTotalDays())
                .approvedById(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getId() : null)
                .approvedByName(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getUsername() : null)
                .approvedAt(leaveRequest.getApprovedAt())
                .rejectedReason(leaveRequest.getRejectedReason())
                .remarks(leaveRequest.getRemarks())
                .createdAt(leaveRequest.getCreatedAt())
                .updatedAt(leaveRequest.getUpdatedAt())
                .build();
    }
}
