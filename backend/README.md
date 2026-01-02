# Walkthrough - Spring Boot JWT Authentication

This project implements a secure Role-Based Access Control (RBAC) system using Spring Boot, JWT, and PostgreSQL.

## Prerequisites
- Docker & Docker Compose
- (Optional) Java 17 for local development

## Running the Application
Since your local environment uses Java 8, **you must use Docker** to run this project.

1. **Build and Run**:
   ```bash
   docker compose up --build -d
   ```
   This will:
   - Build the backend using a Java 17 Docker image.
   - Start the PostgreSQL database.
   - Start the application on port `8080`.

2. **Check Logs**:
   ```bash
   docker logs -f auth_app
   ```

## Testing the API
You can use `curl` or Postman.

### 1. Register a User
*Note: We use `ROLE_USER` exactly as expected by the backend.*
```bash
curl -i -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "sagar", "email": "sagar@test.com", "password": "password123", "roles": ["ROLE_USER"]}'
```

### 2. Login
```bash
curl -i -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "sagar", "password": "password123"}'
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "username": "sagar",
  "roles": ["ROLE_USER"]
}
```

### 3. Access Protected Endpoint
Copy the `token` from the login response.
```bash
curl -i -H "Authorization: Bearer <YOUR_TOKEN>" http://localhost:8080/api/test/user
```

## Project Structure
- `SecurityConfig`: Configures JWT filter and public/private endpoints.
- `JwtUtils`: Handles token generation and validation.
- `AuthService`: Manages user registration and role assignment.
- `Role/Permission`: Dynamic entities in the database.

## Notes
- **Swagger UI**: Access at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) (Note: You may need to authenticate via the "Authorize" button using the Bearer token).
- **Database**: Port `5432` is exposed locally. Connect with `dbeaver` or any client using `user: postgres`, `password: postgres`.
