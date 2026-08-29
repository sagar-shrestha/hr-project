package com.sagar.hr.attendance.repository;

import com.sagar.hr.attendance.entity.OvertimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OvertimeRecordRepository extends JpaRepository<OvertimeRecord, Long> {
    Optional<OvertimeRecord> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    List<OvertimeRecord> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate start, LocalDate end);
}
