package com.sagar.hr.attendance.service;

import com.sagar.hr.attendance.entity.OvertimeRecord;
import com.sagar.hr.attendance.entity.TimeLog;
import com.sagar.hr.attendance.repository.OvertimeRecordRepository;
import com.sagar.hr.attendance.repository.TimeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private static final BigDecimal REGULAR_HOURS_PER_DAY = new BigDecimal("8");
    private static final BigDecimal OVERTIME_RATE = new BigDecimal("1.50");
    private static final BigDecimal REGULAR_HOURS_PER_WEEK = new BigDecimal("48");

    private final TimeLogRepository timeLogRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;

    @Transactional
    public TimeLog punchIn(Long employeeId, Long shiftId, String source) {
        TimeLog timeLog = new TimeLog();
        timeLog.setEmployeeId(employeeId);
        timeLog.setPunchIn(LocalDateTime.now());
        timeLog.setSource(source != null ? source : "MANUAL");
        return timeLogRepository.save(timeLog);
    }

    @Transactional
    public TimeLog punchOut(Long timeLogId) {
        TimeLog timeLog = timeLogRepository.findById(timeLogId)
                .orElseThrow(() -> new IllegalArgumentException("TimeLog not found: " + timeLogId));

        timeLog.setPunchOut(LocalDateTime.now());
        Duration duration = Duration.between(timeLog.getPunchIn(), timeLog.getPunchOut());
        BigDecimal totalHours = BigDecimal.valueOf(duration.toMinutes() / 60.0)
                .setScale(2, RoundingMode.HALF_UP);
        timeLog.setTotalHours(totalHours);

        if (totalHours.compareTo(REGULAR_HOURS_PER_DAY) > 0) {
            BigDecimal overtime = totalHours.subtract(REGULAR_HOURS_PER_DAY)
                    .setScale(2, RoundingMode.HALF_UP);
            timeLog.setOvertimeHours(overtime);

            OvertimeRecord record = overtimeRecordRepository
                    .findByEmployeeIdAndDate(timeLog.getEmployeeId(), LocalDate.from(timeLog.getPunchIn()))
                    .orElseGet(() -> {
                        OvertimeRecord newRecord = new OvertimeRecord();
                        newRecord.setEmployeeId(timeLog.getEmployeeId());
                        newRecord.setDate(LocalDate.from(timeLog.getPunchIn()));
                        newRecord.setRegularHours(REGULAR_HOURS_PER_DAY);
                        newRecord.setOvertimeRate(OVERTIME_RATE);
                        return newRecord;
                    });

            record.setOvertimeHours(overtime);
            overtimeRecordRepository.save(record);
        }

        return timeLogRepository.save(timeLog);
    }

    public Optional<OvertimeRecord> getOvertime(Long employeeId, LocalDate date) {
        return overtimeRecordRepository.findByEmployeeIdAndDate(employeeId, date);
    }
}
