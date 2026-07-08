package com.sagar.hr.audit.mapper;

import com.sagar.hr.audit.dto.response.RevisionResponse;
import com.sagar.hr.util.audit.AuditRevisionEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.RevisionType;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AuditMapper {

    private final ObjectMapper objectMapper;

    public RevisionResponse toRevisionResponse(Object[] row) {
        AuditRevisionEntity revisionInfo = (AuditRevisionEntity) row[1];
        RevisionType revisionType = (RevisionType) row[2];
        Map<String, Object> data = objectMapper.convertValue(row[0], new TypeReference<>() {
        });

        return RevisionResponse.builder()
                .revisionNumber(revisionInfo.getRev())
                .revisionDate(LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(revisionInfo.getTimestamp()), ZoneId.systemDefault()))
                .username(revisionInfo.getUsername())
                .revisionType(revisionType.name())
                .data(data)
                .build();
    }
}
