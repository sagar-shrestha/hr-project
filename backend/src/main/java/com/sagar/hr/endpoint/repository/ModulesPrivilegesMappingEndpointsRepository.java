package com.sagar.hr.endpoint.repository;

import com.sagar.hr.endpoint.entity.ModulesPrivilegesMappingEndpoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModulesPrivilegesMappingEndpointsRepository extends JpaRepository<ModulesPrivilegesMappingEndpoints, Long> {

    boolean existsByModulesIdAndPrivilegesIdAndEndpointId(Long moduleId, Long privilegeId, Long endpointId);
}