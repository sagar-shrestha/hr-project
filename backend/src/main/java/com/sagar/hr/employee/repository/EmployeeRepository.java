package com.sagar.hr.employee.repository;

import com.sagar.hr.employee.entity.Employee;
import com.sagar.hr.employee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findUserById(@Param("id") Long id);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByCitizenshipNumber(String citizenshipNumber);

    Optional<Employee> findByPanNumber(String panNumber);

    boolean existsByIdAndActiveIsTrue(Long id);

    @Query("SELECT e FROM Employee e WHERE TYPE(e) = Employee")
    List<Employee> findAllEmployees();

    @Query("SELECT e FROM Employee e WHERE TYPE(e) = Employee AND e.id = :id")
    Optional<Employee> findEmployeeById(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query(value = """
            UPDATE users SET
                user_type = 'EMPLOYEE',
                name = :#{#name},
                name_nepali = :#{#nameNepali},
                phone = :#{#phone},
                citizenship_number = :#{#citizenshipNumber},
                pan_number = :#{#panNumber},
                nid_number = :#{#nidNumber},
                department_id = :#{#departmentId},
                designation = :#{#designation},
                employee_code = :#{#employeeCode},
                date_of_birth = :#{#dateOfBirth},
                date_of_birth_bs = :#{#dateOfBirthBS},
                join_date = :#{#joinDate},
                join_date_bs = :#{#joinDateBS},
                status = :#{#status}
            WHERE id = :id AND user_type = 'USER'
            """, nativeQuery = true)
    int promoteToEmployee(
            @Param("id") Long id,
            @Param("name") String name,
            @Param("nameNepali") String nameNepali,
            @Param("phone") String phone,
            @Param("citizenshipNumber") String citizenshipNumber,
            @Param("panNumber") String panNumber,
            @Param("nidNumber") String nidNumber,
            @Param("departmentId") Long departmentId,
            @Param("designation") String designation,
            @Param("employeeCode") String employeeCode,
            @Param("dateOfBirth") LocalDate dateOfBirth,
            @Param("dateOfBirthBS") String dateOfBirthBS,
            @Param("joinDate") LocalDate joinDate,
            @Param("joinDateBS") String joinDateBS,
            @Param("status") String status
    );
}
