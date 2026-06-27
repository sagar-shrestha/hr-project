package com.sagar.hr.attendance.repository;

import com.sagar.hr.attendance.entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByEmployeeIdAndPunchInBetween(Long employeeId, LocalDateTime start, LocalDateTime end);
}
