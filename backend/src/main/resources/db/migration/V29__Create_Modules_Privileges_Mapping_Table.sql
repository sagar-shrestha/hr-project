CREATE TABLE IF NOT EXISTS modules_privileges_mapping (
    module_id BIGINT NOT NULL,
    privilege_id BIGINT NOT NULL,
    PRIMARY KEY (module_id, privilege_id),
    CONSTRAINT fk_mpm_module FOREIGN KEY (module_id) REFERENCES modules(id),
    CONSTRAINT fk_mpm_privilege FOREIGN KEY (privilege_id) REFERENCES privileges(id)
);

CREATE TABLE IF NOT EXISTS modules_privileges_mapping_AUD (
    rev BIGINT NOT NULL,
    module_id BIGINT NOT NULL,
    privilege_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, module_id, privilege_id)
);
ALTER TABLE modules_privileges_mapping_AUD ADD CONSTRAINT fk_mpm_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;