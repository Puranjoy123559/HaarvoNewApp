# Haarvo

Full-stack web application built with **Nest.js** (backend) and **Next.js** (frontend), using **PostgreSQL** as the database.

## Tech Stack

| Layer | Technology | .NET Equivalent |
|---|---|---|
| Backend API | Nest.js (Node.js + TypeScript) | ASP.NET Core Web API |
| Frontend | Next.js (React + TypeScript) | Razor Pages / Blazor |
| Database | PostgreSQL | SQL Server |
| ORM | TypeORM | Entity Framework Core |
| Package Manager | npm | NuGet |

## Project Structure

```
Haarvo/
├── backend/        # Nest.js REST API
├── frontend/       # Next.js web application
├── .gitignore
└── README.md
```

## Prerequisites

Before running this project, install the following on your machine:

1. **Node.js** (LTS version) — https://nodejs.org/
2. **PostgreSQL** (version 14 or later) — https://www.postgresql.org/download/
3. **Git** — https://git-scm.com/
4. **VS Code** — https://code.visualstudio.com/

Verify installations:

```bash
node -v
npm -v
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Haarvo
```

### 2. Set up the Backend (Nest.js)

```bash
cd backend
npm install
npm run start:dev
```

The API will start on: `http://localhost:3000`

### 3. Set up the Frontend (Next.js)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The web app will start on: `http://localhost:3001` (or the next available port)

## Environment Variables

Create a `.env` file inside the `backend/` folder. Example:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=haarvo_db

# App
PORT=3000
NODE_ENV=development
```

> Note: `.env` files are git-ignored. Never commit secrets.

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run start:dev` | Run the API in watch (development) mode |
| `npm run build` | Build the project for production |
| `npm run start:prod` | Run the production build |
| `npm run test` | Run unit tests |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Run the Next.js app in development mode |
| `npm run build` | Build the app for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Architecture

The backend follows a clean architecture similar to .NET projects, with clearly separated layers:

- **Entities** — database table definitions (like EF Core entities)
- **DTOs** — data transfer objects for API requests/responses
- **Repositories** — data access layer
- **Services** — business logic layer
- **Controllers** — API endpoints
- **Interfaces** — contracts for services and repositories
- **Constants / Enums** — shared constants and enumerations

> Detailed folder structure documentation will be added as the project grows.

## Author

**Puranjoy Nath**

## License

This project is private and not licensed for public use.
