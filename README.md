# Task Management Application API

A premium, layered-architecture task management API built with Node.js, Express, TypeScript, MongoDB (Mongoose), and Zod.

---

## Technical Features

1. **Layered Architecture**: Organized separation of concerns following clean domain patterns:
   - **Routes**: Handle request path routing, attach authentication, apply role authorization, and apply input validation middleware.
   - **Controllers**: Coordinate HTTP request parsing, status codes, and JSON responses.
   - **Use Cases (Services)**: House pure business logic & authorization rules (independent of Express/HTTP frames).
   - **Repositories**: Encapsulate Mongoose query execution and DB operations.
   - **Models**: Define data schemas and database constraints.
2. **Role-Based Access Control (RBAC)**: Support for **ADMIN** and **MEMBER** user roles with elevated permissions for Admin users.
3. **Multi-User Project Membership**: Projects support owners and multiple member users.
4. **Email-Based User Discovery & Member Management**: Admins can search users by email and manage project members using email addresses.
5. **Robust Input Validation**: Strict validation for request bodies, parameters, and query parameters via **Zod** middleware.
6. **Password Security**: All user passwords are dynamically salted and hashed using `bcryptjs` upon registration.
7. **Structured Error Handling**: Dynamic error response formatting handling specific DB errors (CastError, duplicate fields), validation errors (ZodError), and custom operational errors (via a custom `AppError` class).
8. **Database Migrations and Seeds**: Includes scripts to synchronize database indexes, backfill fields, and seed mock users (Admin + Member), projects, and tasks.
9. **Automated Testing Suite**: Full automated test suite using `vitest` + `supertest` with in-memory MongoDB.

---

## Prerequisites

- **Node.js** (v18.x or higher recommended)
- **MongoDB** (local server running, or a MongoDB Atlas URI)

---

## Quick Start Setup

### 1. Install Dependencies
Navigate to the root directory and install npm dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to create a `.env` file:
```bash
cp .env.example .env
```
Open `.env` and fill in the values:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/todo
PORT=5000
NODE_ENV=development
JWT_SECRET=your-strong-random-secret
```

### 3. Run Database Migrations
Synchronize database indexes and migrate collection schemas:
```bash
npm run db:migrate
```

### 4. Seed Database Data
Populate the database with seed users, projects, and tasks:
```bash
npm run db:seed
```
*Seeded Default Users:*
- **Admin**: Email `admin@example.com` | Password `password123` | Role `ADMIN`
- **Member**: Email `testuser@example.com` | Password `password123` | Role `MEMBER`

---

## Running the Application

### Development Mode
Runs the TypeScript compiler and launches the server:
```bash
npm run dev
```

### Production Mode
Builds the TypeScript codebase and runs the production server:
```bash
npm run build
npm run start
```

### Running Automated Tests
Executes the comprehensive automated API test suite covering authentication, authorization, project membership, task CRUD, and filtering:
```bash
npm test
```

---

## API Endpoints Overview

All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

### 1. Authentication (`/api/auth`)
- `POST /register`: Registers a new user (defaults to `MEMBER` role; requires `fullName`, `email`, `password`).
- `POST /login`: Log in and receive JWT token + user profile (requires `email`, `password`).
- `POST /logout`: Client-side logout acknowledgement.

### 2. Users (`/api/users`)
- `GET /search?email=<query>`: Search registered users by email substring for member discovery.

### 3. Projects (`/api/project`)
- `POST /`: Create a new project (current user becomes owner & initial member).
- `GET /`: Get all projects belonging to or shared with the logged-in user.
- `GET /:id`: Retrieve specific project details (requires membership or Admin role).
- `PUT /:id`: Update project details (`title`, `description`, `status`).
- `DELETE /:id`: Delete project and cascade delete all its tasks.
- `POST /:id/members`: *(Admin only)* Add member to project by email (`{ "email": "user@example.com" }`).
- `DELETE /:id/members`: *(Admin only)* Remove member from project by email (`{ "email": "user@example.com" }`).

### 4. Tasks (`/api/task`)
- `POST /project/:projectId`: Create a task in a project (`title`, `description`, `priority`, `dueDate`, optional `status`, optional `assignee`). `creator` is automatically set from JWT.
- `GET /project/:projectId`: Retrieve project tasks with query filters (`status`, `priority`, `assignee`, `page`, `limit`).
- `GET /:id`: Get specific task details.
- `PUT /:id`: Update task attributes (`title`, `description`, `status`, `priority`, `dueDate`, `assignee`).
- `DELETE /:id`: Delete a task.

#### Valid Enums:
- **Task Statuses**: `TODO`, `IN_PROGRESS`, `DONE`
- **Task Priorities**: `LOW`, `MID`, `HIGH`

---

## Testing via Postman
A complete Postman collection containing all route configuration examples and parameters is included in the root folder as `task-manager-postman_collection.json`. Import this file into Postman to test all endpoints.

---

## Docker Support

### Production Mode (Single-command deployment)
Builds multi-stage Docker images and starts MongoDB + Express server (serving React client static build):
```bash
docker compose up --build
```
- App available at: `http://localhost:5000`
- MongoDB available at: `localhost:27017`

### Development Mode (With Hot-Reload)
Runs MongoDB, backend API server, and React Vite dev server with volume mounts for live code changes:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- React Frontend: `http://localhost:5173`
- Express Backend: `http://localhost:5000`

### Stop & Clean Up
```bash
docker compose down -v
```


