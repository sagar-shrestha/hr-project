CREATE TABLE IF NOT EXISTS endpoint_roles (
    id BIGSERIAL PRIMARY KEY,
    url_pattern VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    role_id BIGINT NOT NULL,
    CONSTRAINT fk_endpoint_role FOREIGN KEY (role_id) REFERENCES roles(id)
);
