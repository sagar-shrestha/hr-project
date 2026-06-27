package com.sagar.hr.reporting.controller;

import com.sagar.hr.reporting.dto.AttendanceSummaryResponse;
import com.sagar.hr.reporting.service.AttendanceSummaryService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reports")
public class ReportingController {

    private final AttendanceSummaryService attendanceSummaryService;

    @GetMapping("/attendance-summary")
    public ResponseEntity<GlobalApiResponse> getAttendanceSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceSummaryResponse> summary = attendanceSummaryService.getSummary(startDate, endDate);
        return ResponseEntity.ok(GlobalApiResponse
                .builder()
                .httpStatus(HttpStatus.OK.value())
                .data(summary)
                .status(true)
                .build());
    }
}
