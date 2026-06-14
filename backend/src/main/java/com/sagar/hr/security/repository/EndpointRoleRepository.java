package com.sagar.hr.security.repository;

import com.sagar.hr.security.model.EndpointRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EndpointRoleRepository extends JpaRepository<EndpointRole, Long> {
    List<EndpointRole> findAll();
}
