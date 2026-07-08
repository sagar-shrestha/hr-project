-- Align schema with the entity model.
-- Generated from the Hibernate schema migrator diff (entity model vs database):
--   - salary_structures money columns are mapped as BigDecimal without explicit
--     precision/scale in the entity, so Hibernate expects NUMERIC(38,2)
--   - time_logs.shift_id has no FK constraint (missing from V9)
-- Unique-constraint renames emitted by the migrator are intentionally omitted
-- (cosmetic only; constraint names are not validated).

ALTER TABLE salary_structures
    ALTER COLUMN basic_salary TYPE NUMERIC(38,2),
    ALTER COLUMN allowances TYPE NUMERIC(38,2),
    ALTER COLUMN deductions TYPE NUMERIC(38,2),
    ALTER COLUMN tax_rate TYPE NUMERIC(38,2);

ALTER TABLE time_logs
    ADD CONSTRAINT fk_time_log_shift FOREIGN KEY (shift_id) REFERENCES shifts(id);
