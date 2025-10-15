# Tasks Manager (Backend)

A small Node.js + TypeScript backend for a task management service used in a pre-training exercise. The project exposes REST endpoints for authentication and task management, uses MongoDB via Mongoose, and includes a worker thread entrypoint for background processing.

This README explains the project structure, how to set up the project locally, available scripts, and a short explanation of key files.

## Table of contents

- Project description
- Folder structure
- Requirements
- Environment variables
- Install & run
- Scripts
- Notes

## Project description

This backend provides basic user authentication (signup/login) and CRUD operations for tasks. It is written in TypeScript and compiled to JavaScript before running. The project uses Express for routing, Mongoose for MongoDB ORM, JWT for authentication, and includes a worker thread entry point for background tasks.

## Folder structure

The repository has the following layout:

```
.
├─ package.json            # npm metadata and scripts
├─ tsconfig.json           # TypeScript compiler configuration
├─ nodemon.json            # nodemon configuration for development
├─ src/
│  ├─ server.ts            # App entrypoint (HTTP server)
│  ├─ worker.ts            # Worker thread entrypoint for background jobs
│  ├─ controllers/
│  │  ├─ authController.ts # Authentication handlers (signup/login)
│  │  └─ taskController.ts # Task CRUD handlers
│  ├─ middleware/
│  │  └─ authMiddleware.ts # JWT auth middleware
│  ├─ models/
│  │  ├─ Task.ts           # Mongoose Task model
│  │  ├─ User.ts           # Mongoose User model
│  │  └─ User.interface.ts # Type definitions for User
│  └─ routes/
│     ├─ authRoutes.ts     # Auth-related routes
│     └─ taskRoutes.ts     # Task-related routes
```

## Requirements

- Node.js 18+ (suggested)
- npm 9+ or compatible
- A running MongoDB instance (local or cloud URI)

## Environment variables

Create a `.env` file in the project root with the following variables (example values):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/tasks-db
JWT_SECRET=your_jwt_secret_here
```

Adjust values to match your environment.

## Install & run

1. Install dependencies:

```powershell
npm install
```

2. Development (watch/reload with nodemon):

```powershell
npm run dev
```

This uses `nodemon` — ensure `nodemon.json` is configured in the repo.

3. Build and run production:

```powershell
npm run build
npm start
```

Note: `npm start` runs the compiled `build/server.js`. The project uses TypeScript; compiled output is expected in `build/`.

## Available scripts

- `npm run dev` — Start the server in development mode using `nodemon` and `ts-node`.
- `npm run build` — Compile TypeScript to JavaScript using `tsc`.
- `npm start` — Build (via `prestart`) and run the compiled server.

## Key files

- `src/server.ts` — Express app boot and route wiring.
- `src/worker.ts` — Background worker entrypoint (uses worker threads).
- `src/controllers/*` — Route handlers for auth and tasks.
- `src/models/*` — Mongoose models and TypeScript interfaces.

## Notes and troubleshooting

- If you see TypeScript compile issues, run `npx tsc --noEmit` to surface errors.
- If MongoDB connection fails, check `MONGO_URI` and network accessibility.
- This project expects the compiled `build/` folder for `npm start`. If you run `node src/server.ts` directly, ensure TypeScript is transpiled or use `ts-node`.

If you'd like, I can also add example .env, a Postman collection, or small Dockerfile to make local development easier. Tell me which one you'd prefer next.
