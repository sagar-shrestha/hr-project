CREATE TABLE IF NOT EXISTS modules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    screens_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT fk_modules_screens_id FOREIGN KEY (screens_id) REFERENCES screens(id)
);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_modules_screens_id ON modules(screens_id);

CREATE TABLE IF NOT EXISTS modules_AUD (
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
    screens_id BIGINT,
    PRIMARY KEY (rev, id)
);
ALTER TABLE modules_AUD ADD CONSTRAINT fk_modules_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;
