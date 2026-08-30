-- Add user_id column to the Envers audit table for Employee.
-- Employee now has a @OneToOne user association; ddl-auto: validate requires
-- the corresponding column in employees_AUD.

ALTER TABLE employees_AUD
    ADD COLUMN user_id BIGINT;
