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
    private Integer present;
    private Integer absent;
    private Integer late;
    private Integer leave;
}
