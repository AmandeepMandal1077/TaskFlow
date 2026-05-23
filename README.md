# TaskFlow

TaskFlow is a modern, full-stack Kanban board application designed to help you organize your work effortlessly. It features a highly interactive drag-and-drop user interface backed by a lightning-fast API.

## 🏗️ Architecture

### 📁 Folder Structure

```text
TaskFlow/
├── backend/            # Express + Bun API
├── frontend/           # Next.js 16 Web App
└── README.md           # Project documentation
```

The project is structured as a monorepo containing two main parts:

- **[`frontend/`](./frontend/README.md):** A React-based web application built with Next.js 16, Tailwind CSS v4, and `@dnd-kit` for seamless drag-and-drop task management.
- **[`backend/`](./backend/README.md):** An Express 5 API running on the blazing fast Bun runtime, using Prisma ORM to interact with a PostgreSQL database.

## 🚀 Quick Start

To get the entire project running locally, you'll need to set up both the backend and the frontend.

### Prerequisites

- [Next.js](https://nextjs.org/) (for the frontend)
- [Express](https://expressjs.com/) (for the backend)
- [PostgreSQL](https://www.postgresql.org/) (running locally or remotely)

### 1. Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up your `.env` file with your `DATABASE_URL`.
4. Initialize the database:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```
5. Start the server:
   ```bash
   bun run dev
   ```

### 2. Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file with the `NEXT_PUBLIC_API_URL` pointing to your backend (e.g., `http://localhost:5000`).
4. Start the development server:
   ```bash
   npm run dev
   ```

## ✨ Features

- **Kanban Board:** Organize tasks into columns (e.g., To Do, In Progress, Done).
- **Drag & Drop:** Smooth and intuitive `@dnd-kit` powered interface.
- **Modern UI:** Built with Radix UI components and Tailwind CSS.
- **High Performance:** Backend runs on Bun, delivering instant responses.
- **Type-Safe:** End-to-end TypeScript coverage.

## 📄 License

This project is licensed under the MIT License.
