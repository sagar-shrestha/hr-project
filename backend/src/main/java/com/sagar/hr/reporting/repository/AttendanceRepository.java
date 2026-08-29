package com.sagar.hr.reporting.repository;

import com.sagar.hr.reporting.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query(value = "SELECT d.name AS department_name, " +
                   "a.status AS status, " +
                   "COUNT(a) AS count " +
                   "FROM attendance a " +
                   "JOIN departments d ON d.id = a.department_id " +
                   "WHERE a.date BETWEEN :startDate AND :endDate " +
                   "GROUP BY d.name, a.status " +
                   "ORDER BY d.name, a.status", nativeQuery = true)
    List<Object[]> findAttendanceSummaryByDateRange(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);
}
