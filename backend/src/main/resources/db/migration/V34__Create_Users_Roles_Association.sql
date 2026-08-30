-- Explicitly create the user <-> role join table (users_roles_association).
-- The @ManyToMany on Employee (User extends Employee) references this table.
--
-- On a fresh DB: V1 creates the legacy `user_roles` table, V2 seeds the
-- super-admin link into it, and V16 creates the `user_roles_AUD` Envers audit
-- table. V34 then creates the real join table under its final name, migrates
-- any existing rows, and drops the legacy table + audit table.
--
-- On an existing DB that already ran V1..V33, this preserves any real role
-- assignments held in `user_roles`.

CREATE TABLE IF NOT EXISTS users_roles_association (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_association_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_users_roles_association_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Carry over any existing rows from the legacy user_roles table.
INSERT INTO users_roles_association (user_id, role_id)
SELECT user_id, role_id FROM user_roles
ON CONFLICT DO NOTHING;

-- Drop the legacy join table (drops its PK and FKs with it).
DROP TABLE IF EXISTS user_roles;

-- Keep the Envers audit history under the new join-table name.
ALTER TABLE user_roles_AUD RENAME TO users_roles_association_AUD;
ALTER TABLE users_roles_association_AUD RENAME CONSTRAINT fk_user_roles_aud_rev TO fk_users_roles_association_aud_rev;
