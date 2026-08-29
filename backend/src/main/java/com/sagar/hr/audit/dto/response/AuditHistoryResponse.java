package com.sagar.hr.audit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AuditHistoryResponse {

    private String entityName;
    private Long entityId;
    private List<RevisionResponse> revisions;
}
