# Project Tasks Management Application

**Fullstack Mini Project – End of Studies Internship 2026**
**Hahn Software Morocco**

---

## Overview

This repository contains a full‑stack web application developed as part of the Hahn Software Morocco – End of Studies Internship 2026 technical test.

The application allows authenticated users to manage projects and their tasks, track progress, and interact with a modern UI enhanced with Three.js for improved user experience.

Authentication is handled using secure HTTP‑only cookies, ensuring tokens are not accessible from JavaScript and improving overall security.

---

## Tech Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* HTTP‑only Cookie Authentication
* Spring Data JPA
* Hibernate
* Flyway (database migrations)
* Maven

### Frontend

* React
* TypeScript
* Tailwind CSS
* Three.js (3D / visual enhancements)
* React Router
* Axios (with credentials enabled)

### Database

* PostgreSQL

---

## Authentication

* Login using email + password
* Authentication token is stored in a secure HTTP‑only cookie
* Cookies are automatically sent with each request
* All API routes are protected except the login endpoint
* CSRF‑safe design suitable for modern web applications

---

## Features

### Projects Management

* Create a project (title + optional description)
* List projects belonging to the authenticated user
* View project details
* View project progress

### Tasks Management

* Create a task with title, description, due date
* Mark a task as completed
* Delete a task
* List all tasks for a project

### Project Progress

* Automatically calculated per project: total tasks, completed tasks, progress percentage
* Displayed visually using a progress bar

---

## Backend Architecture

```
backend/
 └── src/main/java/com/hahn/backend
     ├── auth
     ├── config
     ├── controller
     ├── dto
     ├── entity
     ├── exception
     ├── repository
     ├── security
     ├── service
```

**Key Backend Design Decisions:**

* Clear separation of concerns (Controller / Service / Repository)
* DTOs used for request and response isolation
* Centralized exception handling
* Input validation using `@Valid`
* Stateless authentication using secure cookies

---

## Frontend Architecture

```
frontend/
 └── src/
     ├── api
     ├── components
     ├── pages
     ├── routes
     ├── contexts
     ├── hooks
     ├── types
```

**Key Frontend Design Decisions:**

* Protected routes for authenticated users
* Axios configured with `withCredentials: true`
* Reusable UI components
* Three.js used for visual and interactive enhancements
* Clean separation between UI logic and API calls

## Testing

### Backend Unit Tests

The backend is covered with unit tests using:

* **JUnit 5** – for writing and running tests
* **Spring Boot Test** – for integration and service layer tests
* **Mockito** – for mocking dependencies in service and repository layers
* **Testcontainers** – for running PostgreSQL in tests

#### Running Tests

From the `backend` directory, run:

```bash
mvn test


---

## How to Run the Project

### Prerequisites

* Java 21
* Node.js 18+
* PostgreSQL
* Maven

### Database Setup

Create the database:

```sql
CREATE DATABASE task_manager;
```

Configure backend datasource:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/task_manager
    username: postgres
    password: postgres
```

Flyway will automatically create and migrate the schema on startup.

### Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:7070`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`


## Optional Enhancements Implemented

* Secure cookie-based authentication
* Flyway database migrations
* Three.js integration
* Clean architecture principles
* Modular and maintainable codebase



