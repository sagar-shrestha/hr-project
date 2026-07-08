package com.sagar.hr.leave.controller;

import com.sagar.hr.leave.dto.request.ApplyLeaveRequest;
import com.sagar.hr.leave.dto.request.ApproveRejectRequest;
import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;
import com.sagar.hr.leave.service.LeaveRequestService;
import com.sagar.hr.security.services.UserDetailsImpl;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping("/apply")
    public ResponseEntity<GlobalApiResponse> applyLeave(Authentication authentication,
                                                        @Valid @RequestBody ApplyLeaveRequest request) {
        Long userId = getCurrentUserId(authentication);
        LeaveResponse leave = leaveRequestService.applyLeave(userId, request);
        return ControllerUtil.created("Leave applied", leave);
    }

    @PostMapping("/approve")
    public ResponseEntity<GlobalApiResponse> approveLeave(Authentication authentication,
                                                          @RequestBody ApproveRejectRequest request) {
        Long approverId = getCurrentUserId(authentication);
        LeaveResponse leave = leaveRequestService.approveLeave(request.getId(), approverId, request);
        return ControllerUtil.ok("Leave approved", leave);
    }

    @PostMapping("/reject")
    public ResponseEntity<GlobalApiResponse> rejectLeave(Authentication authentication,
                                                         @RequestBody ApproveRejectRequest request) {
        Long approverId = getCurrentUserId(authentication);
        LeaveResponse leave = leaveRequestService.rejectLeave(request.getId(), approverId, request);
        return ControllerUtil.ok("Leave rejected", leave);
    }

    @GetMapping("/balance")
    public ResponseEntity<GlobalApiResponse> viewBalance(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<LeaveBalanceResponse> balance = leaveRequestService.viewBalance(userId);
        return ControllerUtil.ok("Leave balance retrieved", balance);
    }

    @GetMapping("/my")
    public ResponseEntity<GlobalApiResponse> getMyLeaves(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<LeaveResponse> leaves = leaveRequestService.getUserLeaves(userId);
        return ControllerUtil.ok("My leaves retrieved", leaves);
    }

    @GetMapping("/pending")
    public ResponseEntity<GlobalApiResponse> getPendingLeaves() {
        List<LeaveResponse> leaves = leaveRequestService.getPendingLeaves();
        return ControllerUtil.ok("Pending leaves retrieved", leaves);
    }

    @PostMapping("/initialize-balance")
    public ResponseEntity<GlobalApiResponse> initializeBalance(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        leaveRequestService.initializeLeaveBalance(userId);
        return ControllerUtil.ok("Leave balance initialized", null);
    }

    private Long getCurrentUserId(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
