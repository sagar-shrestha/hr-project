package com.sagar.hr.endpointrole.repository;

import com.sagar.hr.security.model.EndpointRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EndpointRoleRepository extends JpaRepository<EndpointRole, Long> {

    Optional<EndpointRole> findByUrlPatternAndHttpMethod(String urlPattern, String httpMethod);
}
