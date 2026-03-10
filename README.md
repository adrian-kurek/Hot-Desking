# Hot-Desking

Hot-Desking is a simple desk reservation system. This is a monorepo project managed with pnpm workspaces.

## Overview

The project consists of three main parts:
- **`client`**: A React frontend built with Vite, using Material UI for components and tRPC for type-safe API communication.
- **`server`**: A Node.js backend powered by Fastify, providing a tRPC API for the client.
- **`packages/drizzle`**: A shared package for database schema and queries using Drizzle ORM with a PostgreSQL database.

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - React Router
  - Material UI
  - tRPC Client
- **Backend:**
  - Node.js
  - Fastify
  - TypeScript
  - tRPC Server
  - Zod
- **Database:**
  - PostgreSQL
  - Drizzle ORM
- **Monorepo:**
  - pnpm workspaces

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm
- Docker (for running a PostgreSQL database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Hot-Desking
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following, replacing the placeholder with your database connection string:
   ```env
   # ./ .env
   DATABASE_URL=postgres://user:password@localhost:5432/mydb?sslmode=disable
   ```

   Create a `.env` file in the `client` directory:
   ```env
   # ./client/.env
   VITE_URL_BACKEND=http://localhost:3009/trpc
   ```
   *(Note: The server runs on port 3009 by default. Adjust if you change it.)*


4. **Start a PostgreSQL database:**

   You can use Docker to easily start a PostgreSQL database:
   ```bash
   docker run --name some-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
   ```

5. **Run database migrations:**

   This command will push the schema defined in `packages/drizzle` to your database.
   ```bash
   pnpm --filter @hot-desking/drizzle push
   ```

6. **Seed the database:**

   This command will populate the database with initial data.
   ```bash
   pnpm --filter @hot-desking/drizzle seed
   ```

7. **Run the development servers:**

   Open two terminals. In the first, start the backend server:
   ```bash
   pnpm --filter @hot-desking/server dev
   ```

   In the second, start the frontend client:
   ```bash
   pnpm --filter @hot-desking/client dev
   ```

   The client should now be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

| Package                 | Script      | Description                                      |
| ----------------------- | ----------- | ------------------------------------------------ |
| `@hot-desking/client`   | `dev`       | Starts the frontend development server.          |
|                         | `build`     | Builds the frontend for production.              |
|                         | `start`     | Serves the production build.                     |
| `@hot-desking/server`   | `dev`       | Starts the backend development server with watch mode. |
|                         | `build`     | Compiles the backend to JavaScript.              |
|                         | `start`     | Runs the compiled backend code.                  |
|                         | `lint`      | Lints the backend codebase.                      |
| `@hot-desking/drizzle`  | `push`      | Pushes the Drizzle schema to the database.       |
|                         | `seed`      | Seeds the database with initial data.            |
|                         | `build`     | Compiles the package.                            |