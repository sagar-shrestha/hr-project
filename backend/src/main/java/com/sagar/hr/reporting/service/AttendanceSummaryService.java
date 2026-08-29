package com.sagar.hr.reporting.service;

import com.sagar.hr.reporting.dto.AttendanceSummaryResponse;
import com.sagar.hr.reporting.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceSummaryService {

    private final AttendanceRepository attendanceRepository;

    public List<AttendanceSummaryResponse> getSummary(LocalDate startDate, LocalDate endDate) {
        List<Object[]> rows = attendanceRepository.findAttendanceSummaryByDateRange(startDate, endDate);

        Map<String, AttendanceSummaryResponse> summaryMap = new LinkedHashMap<>();

        for (Object[] row : rows) {
            String department = (String) row[0];
            String status = (String) row[1];
            Integer count = ((Integer) row[2]);

            AttendanceSummaryResponse summary = summaryMap.computeIfAbsent(department,
                    k -> AttendanceSummaryResponse.builder()
                            .department(department)
                            .present(0)
                            .absent(0)
                            .late(0)
                            .leave(0)
                            .build());

            switch (status.toUpperCase()) {
                case "PRESENT" -> summary.setPresent(count);
                case "ABSENT" -> summary.setAbsent(count);
                case "LATE" -> summary.setLate(count);
                case "LEAVE" -> summary.setLeave(count);
            }
        }

        return new ArrayList<>(summaryMap.values());
    }
}
