package com.sagar.hr.leave.service;

import com.sagar.hr.leave.dto.request.ApplyLeaveRequest;
import com.sagar.hr.leave.dto.request.ApproveRejectRequest;
import com.sagar.hr.leave.dto.response.LeaveBalanceResponse;
import com.sagar.hr.leave.dto.response.LeaveResponse;
import com.sagar.hr.leave.entity.LeaveBalance;
import com.sagar.hr.leave.entity.LeaveRequest;
import com.sagar.hr.leave.entity.LeaveStatus;
import com.sagar.hr.leave.entity.LeaveType;
import com.sagar.hr.leave.exception.InsufficientLeaveBalanceException;
import com.sagar.hr.leave.mapper.LeaveMapper;
import com.sagar.hr.leave.repository.LeaveBalanceRepository;
import com.sagar.hr.leave.repository.LeaveRequestRepository;
import com.sagar.hr.security.model.User;
import com.sagar.hr.security.repository.UserRepository;
import com.sagar.hr.util.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private static final Map<LeaveType, BigDecimal> ACCRUAL_RULES = new LinkedHashMap<>();

    static {
        ACCRUAL_RULES.put(LeaveType.ANNUAL, BigDecimal.valueOf(18));
        ACCRUAL_RULES.put(LeaveType.SICK, BigDecimal.valueOf(15));
        ACCRUAL_RULES.put(LeaveType.MATERNITY, BigDecimal.valueOf(98));
        ACCRUAL_RULES.put(LeaveType.PATERNITY, BigDecimal.valueOf(15));
        ACCRUAL_RULES.put(LeaveType.HOME, BigDecimal.valueOf(18));
        ACCRUAL_RULES.put(LeaveType.BEREAVEMENT, BigDecimal.valueOf(13));
    }

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;
    private final LeaveMapper leaveMapper;

    @Transactional
    public LeaveResponse applyLeave(Long userId, ApplyLeaveRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        long totalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (totalDays <= 0) {
            throw new IllegalArgumentException("Leave duration must be at least 1 day");
        }

        int year = request.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByUserIdAndLeaveTypeAndYear(userId, request.getLeaveType(), year)
                .orElse(null);

        if (balance != null) {
            BigDecimal remaining = balance.getTotalDays().subtract(balance.getUsedDays());
            if (remaining.compareTo(BigDecimal.valueOf(totalDays)) < 0) {
                throw new InsufficientLeaveBalanceException(
                        "Insufficient " + request.getLeaveType() + " leave balance. "
                                + "Available: " + remaining + " days, Requested: " + totalDays + " days.");
            }
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        leaveRequest.setReason(request.getReason());
        leaveRequest.setTotalDays((int) totalDays);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return leaveMapper.toResponse(saved);
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId, Long approverId, ApproveRejectRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new NotFoundException("Leave request not found with id: " + leaveId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is already " + leaveRequest.getStatus().name().toLowerCase());
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + approverId));

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedAt(LocalDateTime.now());
        leaveRequest.setRemarks(request.getRemarks());

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        int year = leaveRequest.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByUserIdAndLeaveTypeAndYear(leaveRequest.getUser().getId(), leaveRequest.getLeaveType(), year)
                .orElse(null);

        if (balance != null) {
            balance.setUsedDays(balance.getUsedDays().add(BigDecimal.valueOf(leaveRequest.getTotalDays())));
            leaveBalanceRepository.save(balance);
        }

        return leaveMapper.toResponse(saved);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, Long approverId, ApproveRejectRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new NotFoundException("Leave request not found with id: " + leaveId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is already " + leaveRequest.getStatus().name().toLowerCase());
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + approverId));

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setRejectedReason(request.getRemarks());
        leaveRequest.setRemarks(request.getRemarks());

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return leaveMapper.toResponse(saved);
    }

    public List<LeaveBalanceResponse> viewBalance(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found with id: " + userId);
        }

        int currentYear = LocalDate.now().getYear();
        List<LeaveBalance> balances = leaveBalanceRepository.findByUserIdAndYear(userId, currentYear);
        Set<LeaveType> existingTypes = balances.stream()
                .map(LeaveBalance::getLeaveType)
                .collect(Collectors.toSet());

        List<LeaveBalanceResponse> result = new ArrayList<>();

        for (Map.Entry<LeaveType, BigDecimal> entry : ACCRUAL_RULES.entrySet()) {
            LeaveType type = entry.getKey();
            BigDecimal totalDays = entry.getValue();

            if (existingTypes.contains(type)) {
                LeaveBalance balance = balances.stream()
                        .filter(b -> b.getLeaveType() == type)
                        .findFirst().get();
                result.add(LeaveBalanceResponse.builder()
                        .leaveType(type)
                        .totalDays(balance.getTotalDays())
                        .usedDays(balance.getUsedDays())
                        .remainingDays(balance.getTotalDays().subtract(balance.getUsedDays()))
                        .build());
            } else {
                result.add(LeaveBalanceResponse.builder()
                        .leaveType(type)
                        .totalDays(totalDays)
                        .usedDays(BigDecimal.ZERO)
                        .remainingDays(totalDays)
                        .build());
            }
        }

        return result;
    }

    @Transactional
    public void initializeLeaveBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        int currentYear = LocalDate.now().getYear();

        for (Map.Entry<LeaveType, BigDecimal> entry : ACCRUAL_RULES.entrySet()) {
            if (leaveBalanceRepository.findByUserIdAndLeaveTypeAndYear(userId, entry.getKey(), currentYear).isEmpty()) {
                LeaveBalance balance = new LeaveBalance();
                balance.setUser(user);
                balance.setLeaveType(entry.getKey());
                balance.setTotalDays(entry.getValue());
                balance.setUsedDays(BigDecimal.ZERO);
                balance.setYear(currentYear);
                leaveBalanceRepository.save(balance);
            }
        }
    }

    public List<LeaveResponse> getUserLeaves(Long userId) {
        return leaveRequestRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(leaveMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveResponse> getPendingLeaves() {
        return leaveRequestRepository.findByStatusOrderByCreatedAtAsc(LeaveStatus.PENDING).stream()
                .map(leaveMapper::toResponse)
                .collect(Collectors.toList());
    }
}
