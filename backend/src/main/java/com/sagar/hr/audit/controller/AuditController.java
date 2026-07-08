package com.sagar.hr.audit.controller;

import com.sagar.hr.audit.dto.response.AuditHistoryResponse;
import com.sagar.hr.audit.service.AuditService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/{entityName}/{id}")
    public ResponseEntity<GlobalApiResponse> getAuditHistory(@PathVariable String entityName, @PathVariable Long id) {
        AuditHistoryResponse response = auditService.getAuditHistory(entityName, id);
        return ControllerUtil.ok("Audit history retrieved", response);
    }
}
