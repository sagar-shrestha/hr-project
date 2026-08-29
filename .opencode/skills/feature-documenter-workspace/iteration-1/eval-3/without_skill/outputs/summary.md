# Summary: Departments & Employee-Department Link

## What was done

1. **Created Flyway migration `V6__Create_Departments_Table.sql`** at `backend/src/main/resources/db/migration/`
   - Creates `departments` table (`CREATE TABLE IF NOT EXISTS`) with columns:
     - `id` UUID (default `gen_random_uuid()`, PK)
     - `name` VARCHAR(100) NOT NULL
     - `code` VARCHAR(20) NOT NULL UNIQUE
     - `created_at` TIMESTAMP DEFAULT NOW()
     - `updated_at` TIMESTAMP DEFAULT NOW()
   - Adds `department_id` UUID column to `employees` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`)
   - Creates index on `employees(department_id)`
   - Adds FK constraint from `employees.department_id` → `departments.id`

2. **Created `Department` entity** at `backend/src/main/java/com/sagar/hr/department/model/Department.java`
   - JPA entity mapped to `departments` table
   - Uses UUID primary key with `GenerationType.UUID`
   - Uses `@PrePersist`/`@PreUpdate` lifecycle callbacks for automatic timestamps

3. **Created `DepartmentRepository`** at `backend/src/main/java/com/sagar/hr/department/repository/DepartmentRepository.java`
   - Extends `JpaRepository<Department, UUID>`
   - Custom finders: `findByCode`, `findByName`

4. **Created `DepartmentService`** at `backend/src/main/java/com/sagar/hr/department/service/DepartmentService.java`
   - Basic CRUD operations: `findAll`, `findById`, `findByCode`, `findByName`, `save`, `deleteById`, `existsById`
   - Uses constructor injection

## Files created

| File | Path |
|------|------|
| Migration | `backend/src/main/resources/db/migration/V6__Create_Departments_Table.sql` |
| Entity | `backend/src/main/java/com/sagar/hr/department/model/Department.java` |
| Repository | `backend/src/main/java/com/sagar/hr/department/repository/DepartmentRepository.java` |
| Service | `backend/src/main/java/com/sagar/hr/department/service/DepartmentService.java` |
