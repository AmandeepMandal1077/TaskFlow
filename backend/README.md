# TaskFlow Backend

This is the backend service for TaskFlow, built with [Express](https://expressjs.com/) and powered by the [Bun](https://bun.sh/) runtime for blazing fast performance. It uses [Prisma](https://www.prisma.io/) as the ORM to connect to a PostgreSQL database and [Zod](https://zod.dev/) for schema validation.

## 🚀 Tech Stack

- **Runtime:** Bun
- **Framework:** Express (v5)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Language:** TypeScript

## 📁 Folder Structure

```text
backend/
├── prisma.config.ts    # Prisma configuration
├── src/                # Source code
├── .env                # Environment variables (not tracked)
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Setup & Installation

1. **Install Dependencies:**
   Ensure you have [Bun](https://bun.sh/) installed, then run:
   ```bash
   bun install
   ```

2. **Environment Variables:**
   Create a `.env` file in the `backend` directory and configure your PostgreSQL database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/taskflow_db?schema=public"
   PORT=5000
   ```

3. **Database Setup:**
   Generate the Prisma client and run migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. **Seed Database (Optional):**
   ```bash
   bun run db:seed
   ```

## 💻 Running the Server

- **Development:**
  ```bash
  bun run dev
  ```
  *Runs the server in watch mode.*

- **Production Build:**
  ```bash
  bun run build
  bun run start
  ```

## 📜 Available Scripts

- `bun run dev`: Start the development server with hot-reload.
- `bun run build`: Compile the TypeScript code to JavaScript.
- `bun run start`: Start the production server.
- `bun run db:generate`: Generate Prisma Client.
- `bun run db:migrate`: Run Prisma migrations.
- `bun run db:seed`: Seed the database with initial data.
