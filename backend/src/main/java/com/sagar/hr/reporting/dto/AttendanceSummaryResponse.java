package com.sagar.hr.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {

    private String department;
    private long present;
    private long absent;
    private long late;
    private long leave;
}
