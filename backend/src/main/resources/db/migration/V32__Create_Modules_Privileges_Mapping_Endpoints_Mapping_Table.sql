-- Many-to-many link between modules_privileges_mapping (module + privilege pair)
-- and endpoints. Each row ties one endpoint to one (module, privilege) pair.
CREATE TABLE IF NOT EXISTS modules_privileges_mapping_endpoints_mapping (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    privilege_id BIGINT NOT NULL,
    endpoint_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uq_mpme_pair_endpoint UNIQUE (module_id, privilege_id, endpoint_id),
    CONSTRAINT fk_mpme_module FOREIGN KEY (module_id) REFERENCES modules(id),
    CONSTRAINT fk_mpme_privilege FOREIGN KEY (privilege_id) REFERENCES privileges(id),
    CONSTRAINT fk_mpme_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints(id)
);
CREATE INDEX IF NOT EXISTS idx_mpme_endpoint ON modules_privileges_mapping_endpoints_mapping(endpoint_id);

CREATE TABLE IF NOT EXISTS modules_privileges_mapping_endpoints_mapping_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    module_id BIGINT,
    privilege_id BIGINT,
    endpoint_id BIGINT,
    PRIMARY KEY (rev, id)
);
ALTER TABLE modules_privileges_mapping_endpoints_mapping_AUD ADD CONSTRAINT fk_mpme_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;