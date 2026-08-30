package com.sagar.hr.modules.repository;

import com.sagar.hr.modules.entity.Modules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModulesRepository extends JpaRepository<Modules, Long> {

    Optional<Modules> findByName(String name);

    Optional<Modules> findByCode(String code);

    List<Modules> findAllByScreensId(Long screensId);

    @Modifying
    @Query(value = "UPDATE modules SET status = 'INACTIVE', active = false WHERE id = :id", nativeQuery = true)
    void deleteModulesById(@Param("id") long id);
}
