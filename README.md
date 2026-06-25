# Task Management Application API

A premium, layered-architecture task management API built with Node.js, Express, TypeScript, MongoDB (Mongoose), and Zod.

---

## Technical Features

1. **Layered Architecture**: Organized separation of concerns following clean domain patterns:
   - **Routes**: Handle request path routing, attach authentication, and apply input validation middleware.
   - **Controllers**: Coordinate HTTP request parsing, status codes, and JSON responses.
   - **Use Cases (Services)**: House pure business logic (independent of Express/HTTP frames).
   - **Repositories**: Encapsulate Mongoose query execution and DB operations.
   - **Models**: Define data schemas and database constraints.
2. **Robust Input Validation**: Strict validation for request bodies, parameters, and query parameters via **Zod** middleware.
3. **Password Security**: All user passwords are dynamically salted and hashed using `bcryptjs` upon registration.
4. **Structured Error Handling**: Dynamic error response formatting handling specific DB errors (CastError, duplicate fields), validation errors (ZodError), and custom operational errors (via a custom `AppError` class).
5. **Database Migrations and Seeds**: Includes scripts to synchronize database indexes and seed mock users/projects/tasks.

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
Open `.env` and fill in the values. Ensure you change the `JWT_SECRET` to a strong random string:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/todo
PORT=5000
NODE_ENV=development
JWT_SECRET=your-strong-random-secret
```

### 3. Run Database Migrations
Synchronize database indexes and configure collections:
```bash
npm run db:migrate
```

### 4. Seed Database Data
Populate the database with a test user, projects, and tasks for local development:
```bash
npm run db:seed
```
*Note: This creates a default user:*
- **Email**: `testuser@example.com`
- **Password**: `password123`

---

## Running the Application

### Development Mode
Runs the TypeScript compiler and launches the server with automatic recompilation on file changes:
```bash
npm run dev
```

### Production Mode
Builds the TypeScript codebase into clean Javascript and runs the production build:
```bash
npm run build
npm run start
```

---

## API Endpoints Overview

The application features full CRUD operations for **Projects** and **Tasks**, secured with JWT authentication. 

### 1. Authentication (`/api/auth`)
- `POST /register`: Registers a new user (requires `fullName`, `email`, `password`).
- `POST /login`: Log in and get JWT token (requires `email`, `password`).
- `POST /logout`: Invalidates the session.

### 2. Projects (`/api/projects`)
*(All project endpoints require a valid JWT bearer token)*
- `POST /`: Create a new project.
- `GET /`: Get all projects belonging to the logged-in user.
- `GET /:id`: Retrieve a specific project.
- `PUT /:id`: Update project details (`title`, `description`, `status`).
- `DELETE /:id`: Delete project and its dependencies.

### 3. Tasks (`/api/tasks`)
*(All task endpoints require a valid JWT bearer token)*
- `POST /project/:projectId`: Create a task under a specific project.
- `GET /project/:projectId`: Retrieve all tasks for a project (supports filter queries such as `status`, `priority`, and pagination parameters).
- `GET /:id`: Get specific task details.
- `PUT /:id`: Update task attributes (`title`, `description`, `status`, `priority`, `dueDate`).
- `DELETE /:id`: Delete a task.

---

## Testing via Postman
A complete Postman collection containing all route configuration examples and parameters is included in the root folder as `task-manager-postman_collection.json`. Import this file into Postman to quickly test all endpoints.
