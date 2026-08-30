package com.sagar.hr.audit.service;

import com.sagar.hr.attendance.entity.OvertimeRecord;
import com.sagar.hr.attendance.entity.Shift;
import com.sagar.hr.attendance.entity.TimeLog;
import com.sagar.hr.audit.dto.response.AuditHistoryResponse;
import com.sagar.hr.audit.dto.response.RevisionResponse;
import com.sagar.hr.audit.mapper.AuditMapper;
import com.sagar.hr.department.model.Department;
import com.sagar.hr.employee.entity.Employee;
import com.sagar.hr.employee.entity.User;
import com.sagar.hr.endpoint.entity.Endpoint;
import com.sagar.hr.leave.entity.LeaveBalance;
import com.sagar.hr.leave.entity.LeaveRequest;
import com.sagar.hr.payroll.model.SalaryStructure;
import com.sagar.hr.reporting.model.Attendance;
import com.sagar.hr.security.model.Permission;
import com.sagar.hr.security.model.Role;
import com.sagar.hr.util.exception.NotFoundException;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Map<String, Class<?>> AUDITED_ENTITIES = Map.ofEntries(
            Map.entry("employee", Employee.class),
            Map.entry("department", Department.class),
            Map.entry("leave-request", LeaveRequest.class),
            Map.entry("leave-balance", LeaveBalance.class),
            Map.entry("salary-structure", SalaryStructure.class),
            Map.entry("shift", Shift.class),
            Map.entry("time-log", TimeLog.class),
            Map.entry("overtime-record", OvertimeRecord.class),
            Map.entry("attendance", Attendance.class),
            Map.entry("user", User.class),
            Map.entry("role", Role.class),
            Map.entry("permission", Permission.class),
            Map.entry("endpoint", Endpoint.class)
    );

    private final EntityManager entityManager;
    private final AuditMapper auditMapper;

    @Transactional(readOnly = true)
    public AuditHistoryResponse getAuditHistory(String entityName, Long id) {
        Class<?> entityClass = AUDITED_ENTITIES.get(entityName.toLowerCase(Locale.ROOT));
        if (entityClass == null) {
            throw new NotFoundException("No audited entity registered for name: " + entityName);
        }

        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        List<Object[]> revisions = auditReader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true)
                .add(AuditEntity.id().eq(id))
                .getResultList();

        if (revisions.isEmpty()) {
            throw new NotFoundException("No audit history found for " + entityName + " with id: " + id);
        }

        List<RevisionResponse> revisionResponses = revisions.stream()
                .map(auditMapper::toRevisionResponse)
                .toList();

        return AuditHistoryResponse.builder()
                .entityName(entityName)
                .entityId(id)
                .revisions(revisionResponses)
                .build();
    }
}
