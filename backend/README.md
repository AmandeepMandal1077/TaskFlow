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

```
backend/
├── prisma.config.ts          # Prisma client & config helper used by the app
├── src/                      # Application source code
│   ├── app.ts                # Express app setup (middleware, routes, error handler)
│   ├── server.ts             # Server bootstrap (listen, env checks)
│   ├── generated/prisma/     # Prisma generated client and types (do not edit)
│   │   ├── client.ts
│   │   └── ...
│   ├── lib/
│   │   └── prisma.ts         # Prisma client wrapper used across the app
│   ├── middlewares/          # Express middlewares
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── validateResource.ts
│   ├── modules/              # Feature modules (grouped by domain)
│   │   ├── board/
│   │   │   ├── board.route.ts        # Route definitions
│   │   │   ├── board.controller.ts   # Request handlers
│   │   │   ├── board.repository.ts   # DB access via Prisma
│   │   │   └── board.schema.ts       # Zod schemas + request validation
│   │   ├── list/                     # Similar structure for lists
│   │   ├── card/                     # Cards (controller, repository, route, schema)
│   │   ├── label/                    # Labels
│   │   └── user/                     # User auth / profile
│   ├── prisma/                 # Source-managed Prisma files
│   │   ├── schema.prisma       # Database schema (migrations generated from this)
│   │   └── seed.ts             # Optional seed script for initial data
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts      # App-specific type augmentations for Express
│   └── utils/                  # Small helpers used across modules
│       ├── ApiError.ts
│       ├── ApiResponse.ts
│       ├── asyncHandler.ts
│       └── date.ts
├── .env                       # Environment variables (not committed)
├── package.json               # Scripts, dependencies and Bun tasks
└── tsconfig.json              # TypeScript compiler config
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
   DATABASE_URL=your_database_url
   PORT=3001
   FRONTEND_URL=http://localhost:3000
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

  _Runs the server in watch mode._

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
