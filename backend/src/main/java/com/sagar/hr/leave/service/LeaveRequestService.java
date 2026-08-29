package com.sagar.hr.leave.service;

import com.sagar.hr.leave.dto.request.ApplyLeaveRequest;
import com.sagar.hr.leave.dto.request.ApproveRejectRequest;
import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;

import java.util.List;

public interface LeaveRequestService {

    LeaveResponse applyLeave(Long userId, ApplyLeaveRequest request);

    LeaveResponse approveLeave(Long leaveId, Long approverId, ApproveRejectRequest request);

    LeaveResponse rejectLeave(Long leaveId, Long approverId, ApproveRejectRequest request);

    List<LeaveBalanceResponse> viewBalance(Long userId);

    void initializeLeaveBalance(Long userId);

    List<LeaveResponse> getUserLeaves(Long userId);

    List<LeaveResponse> getPendingLeaves();
}
