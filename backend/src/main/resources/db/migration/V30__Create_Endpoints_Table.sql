CREATE TABLE IF NOT EXISTS endpoints (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    url_pattern VARCHAR(255) NOT NULL UNIQUE,
    http_method VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_endpoints_status ON endpoints(status);

CREATE TABLE IF NOT EXISTS endpoints_AUD (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    active BOOLEAN,
    created_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),
    code VARCHAR(20),
    http_method VARCHAR(10),
    name VARCHAR(100),
    status VARCHAR(20),
    url_pattern VARCHAR(255),
    PRIMARY KEY (rev, id)
);
ALTER TABLE endpoints_AUD ADD CONSTRAINT fk_endpoints_aud_rev FOREIGN KEY (rev) REFERENCES revinfo;