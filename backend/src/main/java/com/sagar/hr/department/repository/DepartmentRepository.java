package com.sagar.hr.department.repository;

import com.sagar.hr.department.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
    Optional<Department> findByCode(String code);

    @Modifying
    @Query(value = "UPDATE departments SET status = 'INACTIVE', active = false WHERE id = :id", nativeQuery = true)
    void deleteDepartmentById(@Param("id") long id);
}
