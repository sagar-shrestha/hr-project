package com.sagar.hr.audit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RevisionResponse {

    private Long revisionNumber;
    private LocalDateTime revisionDate;
    private String username;
    private String revisionType;
    private Map<String, Object> data;
}
