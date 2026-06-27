package com.sagar.hr.leave.controller;

import com.sagar.hr.leave.dto.request.ApplyLeaveRequest;
import com.sagar.hr.leave.dto.request.ApproveRejectRequest;
import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;
import com.sagar.hr.leave.service.LeaveRequestService;
import com.sagar.hr.security.dto.response.MessageResponse;
import com.sagar.hr.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(Authentication authentication,
                                        @Valid @RequestBody ApplyLeaveRequest request) {
        try {
            Long userId = getCurrentUserId(authentication);
            LeaveResponse response = leaveRequestService.applyLeave(userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<?> approveLeave(Authentication authentication,
                                          @PathVariable Long id,
                                          @RequestBody ApproveRejectRequest request) {
        try {
            Long approverId = getCurrentUserId(authentication);
            LeaveResponse response = leaveRequestService.approveLeave(id, approverId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<?> rejectLeave(Authentication authentication,
                                         @PathVariable Long id,
                                         @RequestBody ApproveRejectRequest request) {
        try {
            Long approverId = getCurrentUserId(authentication);
            LeaveResponse response = leaveRequestService.rejectLeave(id, approverId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> viewBalance(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            List<LeaveBalanceResponse> balances = leaveRequestService.viewBalance(userId);
            return ResponseEntity.ok(balances);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyLeaves(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            List<LeaveResponse> leaves = leaveRequestService.getUserLeaves(userId);
            return ResponseEntity.ok(leaves);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<?> getPendingLeaves() {
        try {
            return ResponseEntity.ok(leaveRequestService.getPendingLeaves());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/initialize-balance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<?> initializeBalance(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            leaveRequestService.initializeLeaveBalance(userId);
            return ResponseEntity.ok(new MessageResponse("Leave balances initialized successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    private Long getCurrentUserId(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
