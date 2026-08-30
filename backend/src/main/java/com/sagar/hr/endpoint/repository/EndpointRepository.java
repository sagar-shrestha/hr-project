package com.sagar.hr.endpoint.repository;

import com.sagar.hr.endpoint.entity.Endpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EndpointRepository extends JpaRepository<Endpoint, Long> {

    Optional<Endpoint> findByName(String name);

    Optional<Endpoint> findByCode(String code);

    Optional<Endpoint> findByUrlPattern(String urlPattern);

    @Modifying
    @Query(value = "UPDATE endpoints SET status = 'INACTIVE', active = false WHERE id = :id", nativeQuery = true)
    void deleteEndpointById(@Param("id") long id);
}