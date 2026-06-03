# HR Project Structure

## 1. Backend (`/backend`)
- **Language:** Java 17
- **Framework:** Spring Boot 3.2.1
- **Key Dependencies:**
  - Spring Web, Spring Security, Spring Data JPA, Spring Validation
  - PostgreSQL Driver
  - Flyway for Database Migrations
  - JJWT (0.11.5) for Authentication
  - Springdoc OpenAPI (Swagger) for API documentation
  - Lombok for boilerplate reduction
- **Build Tool:** Maven

## 2. Frontend (`/frontend`)
- **Language:** TypeScript (~5.9.2)
- **Framework:** Angular 21.2.0
- **Key Dependencies:**
  - TailwindCSS, PostCSS, Autoprefixer for styling
  - Tailwind-merge, Tailwindcss-animate
  - clsx
  - Lucide-angular for icons
  - RxJS for reactive programming
- **Package Manager:** npm

## 3. Global Configurations
- Docker setup (`backend/Dockerfile`, `backend/docker-compose.yml`)
- AI Memory System (`.ai-memory/`)
