package com.sagar.hr.privileges.repository;

import com.sagar.hr.privileges.entity.Privileges;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivilegesRepository extends JpaRepository<Privileges, Long> {

    Optional<Privileges> findByName(String name);

    Optional<Privileges> findByCode(String code);

    @Modifying
    @Query(value = "UPDATE privileges SET status = 'INACTIVE', active = false WHERE id = :id", nativeQuery = true)
    void deletePrivilegesById(@Param("id") long id);
}
