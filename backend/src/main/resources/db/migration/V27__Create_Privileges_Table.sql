CREATE TABLE IF NOT EXISTS privileges (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_privileges_status ON privileges(status);

CREATE TABLE IF NOT EXISTS privileges_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    code VARCHAR(20),
    name VARCHAR(100),
    status VARCHAR(20),
    PRIMARY KEY (rev, id)
);
ALTER TABLE privileges_AUD ADD CONSTRAINT fk_privileges_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
