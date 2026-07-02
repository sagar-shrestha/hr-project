package com.sagar.hr.leave.controller;

import com.sagar.hr.leave.dto.request.ApplyLeaveRequest;
import com.sagar.hr.leave.dto.request.ApproveRejectRequest;
import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;
import com.sagar.hr.leave.service.LeaveRequestService;
import com.sagar.hr.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<LeaveResponse> applyLeave(Authentication authentication,
                                                    @Valid @RequestBody ApplyLeaveRequest request) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequestService.applyLeave(userId, request));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<LeaveResponse> approveLeave(Authentication authentication,
                                                      @PathVariable Long id,
                                                      @RequestBody ApproveRejectRequest request) {
        Long approverId = getCurrentUserId(authentication);
        return ResponseEntity.ok(leaveRequestService.approveLeave(id, approverId, request));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<LeaveResponse> rejectLeave(Authentication authentication,
                                                     @PathVariable Long id,
                                                     @RequestBody ApproveRejectRequest request) {
        Long approverId = getCurrentUserId(authentication);
        return ResponseEntity.ok(leaveRequestService.rejectLeave(id, approverId, request));
    }

    @GetMapping("/balance")
    public ResponseEntity<List<LeaveBalanceResponse>> viewBalance(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(leaveRequestService.viewBalance(userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveResponse>> getMyLeaves(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(leaveRequestService.getUserLeaves(userId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<List<LeaveResponse>> getPendingLeaves() {
        return ResponseEntity.ok(leaveRequestService.getPendingLeaves());
    }

    @PostMapping("/initialize-balance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> initializeBalance(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        leaveRequestService.initializeLeaveBalance(userId);
        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
