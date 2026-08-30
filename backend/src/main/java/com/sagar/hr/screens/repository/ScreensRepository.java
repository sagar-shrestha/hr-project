package com.sagar.hr.screens.repository;

import com.sagar.hr.screens.entity.Screens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScreensRepository extends JpaRepository<Screens, Long> {

    Optional<Screens> findByName(String name);

    Optional<Screens> findByCode(String code);

    @Modifying
    @Query(value = "UPDATE screens SET status = 'INACTIVE', active = false WHERE id = :id", nativeQuery = true)
    void deleteScreensById(@Param("id") long id);
}
