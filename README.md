# Full-Stack Task Management Application

A full-stack task management application built with a **Node.js/Express TypeScript API** and a modern **React 19 / Vite / TailwindCSS SPA**.

---

## 🏗️ Architecture Overview

The project is structured as a monorepo containing a layered backend REST API and a feature-based React client.

```text
electropi/
├── client/                     # Frontend (React 19, Vite, TailwindCSS)
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptor & API endpoints
│   │   ├── components/         # Reusable UI components, layouts, and form fields
│   │   ├── features/           # Feature modules (auth, projects, tasks)
│   │   ├── routes/             # React Router v7 configuration & ProtectedRoute
│   │   ├── stores/             # Zustand state management (authStore)
│   │   ├── types/              # Shared TypeScript definitions
│   │   └── validation/         # Zod client schemas
│   └── vite.config.ts          # Vite server & API proxy setup
├── src/                        # Backend REST API (Node.js, Express, TypeScript)
│   ├── controllers/            # HTTP request handlers
│   ├── db/                     # Migrations & seed scripts
│   ├── lib/                    # DB connection utility
│   ├── middleware/         # Auth, RBAC authorization, Zod validation, error handling
│   ├── models/                 # Mongoose schemas & TypeScript interfaces
│   ├── repositories/           # Database queries & population logic
│   ├── routes/                 # Express path routing & route middleware
│   ├── usecases/               # Pure business & authorization logic
│   └── server.ts               # Express entrypoint & static client serving
├── docker-compose.yml          # Production Docker Compose setup
├── docker-compose.dev.yml      # Development Docker Compose setup with hot-reload
└── Dockerfile                  # Multi-stage production build
```

### Backend Architecture
- **Layered Clean Architecture**: Strict separation of concerns (Routes → Controllers → Use Cases → Repositories → Mongoose Models).
- **Document Population**: `owner`, `members`, `creator`, and `assignee` fields are populated on database queries.
- **Role-Based Access Control (RBAC)**: Support for **ADMIN** and **MEMBER** system roles, with **Project Owner** permissions for project-level member management.
- **Input Validation & Security**: **Zod** middleware for body/query validation, `bcryptjs` password hashing, JWT authentication, **Helmet** security headers, and rate limiting.

### Frontend Architecture
- **Tech Stack**: React 19, Vite 6, TailwindCSS v4, TanStack React Query v5, Zustand v5, React Router v7, Lucide Icons, React Hook Form + Zod.
- **Features**:
  - **Auth**: Login & Registration with JWT token persistence.
  - **Projects**: Dashboard, project detail view, project creation/editing, and Member Management (Project Owners and Admins can search existing users by email and add/remove project members).
  - **Tasks**: Interactive Kanban Board (Todo, In Progress, Done), Tabular task view, priority/status filtering, search, task creation, editing, assignment, and deletion.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (copied from `.env.example`):

```env
# MongoDB Connection String (local MongoDB or Atlas URI)
MONGODB_URI=mongodb://127.0.0.1:27017/todo

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your-strong-random-secret

# Client CORS URL (Production)
CLIENT_URL=http://localhost:5000
```

---

## 🗄️ Database Migrations & Seeding

### 1. Database Migrations
Synchronize database indexes and schema migrations:
```bash
npm run db:migrate
```

### 2. Database Seeding
Populate the database with initial users, projects, and tasks:
```bash
npm run db:seed
```

#### Seeded User Credentials (Default Password: `password123`)
| Name | Email | System Role | Default Password |
|---|---|---|---|
| **Admin User** | `admin@example.com` | `ADMIN` | `password123` |
| **Test Member** | `testuser@example.com` | `MEMBER` | `password123` |
| **John Doe** | `john@example.com` | `MEMBER` | `password123` |

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### 2. Start Development Servers
Run both backend API (`port 5000`) and frontend Vite dev server (`port 5173`) concurrently:
```bash
npm run dev:all
```

Alternatively, run them separately:
```bash
# Server only
npm run dev:server

# Client only
npm run dev:client
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🐳 Docker Deployment

### Production Mode (Single Command)
Builds a multi-stage Docker image and runs MongoDB + Express server (which serves the compiled React app as static files):
```bash
docker compose up --build
```
- **Application URL**: `http://localhost:5000`
- **MongoDB Port**: `localhost:27017`

### Development Mode (With Hot-Reload)
Runs MongoDB, Express API server, and Vite dev server in containers with host volume mounts:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- **React Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5000`

### Stop Containers & Remove Volumes
```bash
docker compose down -v
```

---

## 🧪 Testing & Code Quality

### Automated API Tests
Executes Vitest automated API test suite covering authentication, RBAC, project membership, and task CRUD using an in-memory MongoDB server:
```bash
npm test
```

### Frontend Code Linting
Run Oxlint code quality checks on the client application:
```bash
npm run lint --prefix client
```

---

## 📡 API Endpoints Overview

All protected endpoints require a valid JWT Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

### 🔑 Authentication (`/api/auth`)
- `POST /register`: Register a new user (`fullName`, `email`, `password`).
- `POST /login`: Log in user and receive JWT token (`email`, `password`).
- `POST /logout`: Client logout acknowledgement.

### 👤 Users (`/api/users`)
- `GET /search?email=<query>`: Search registered users by email for member discovery.

### 📁 Projects (`/api/project`)
- `POST /`: Create project (creator becomes owner and first member).
- `GET /`: List projects where the user is an owner or member.
- `GET /:id`: Get project details.
- `PUT /:id`: Update project details.
- `DELETE /:id`: Delete project and cascade-delete tasks.
- `POST /:id/members`: Add member to project by email (Project Owner or Admin only).
- `DELETE /:id/members`: Remove member from project by email (Project Owner or Admin only).

### 📋 Tasks (`/api/task`)
- `POST /project/:projectId`: Create task in project.
- `GET /project/:projectId`: List project tasks with pagination and filters (`status`, `priority`, `assignee`, `page`, `limit`).
- `GET /:id`: Get task details.
- `PUT /:id`: Update task details (status, priority, assignee, etc.).
- `DELETE /:id`: Delete task.

---

## 📬 Postman Collection
A complete Postman collection is included in the project root:
`task-manager-postman_collection.json`. Import this file into Postman to test all REST API endpoints.
