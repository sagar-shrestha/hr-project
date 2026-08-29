package com.sagar.hr.leave.repository;

import com.sagar.hr.leave.entity.LeaveRequest;
import com.sagar.hr.leave.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LeaveRequest> findByStatusOrderByCreatedAtAsc(LeaveStatus status);
    List<LeaveRequest> findByApprovedById(Long approvedById);
}
