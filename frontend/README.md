# TaskFlow Frontend

This is the frontend application for TaskFlow, built with [Next.js](https://nextjs.org/) (App Router) and [React](https://react.dev/). It features a beautiful, modern UI styled with [Tailwind CSS v4](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/), with drag-and-drop capabilities powered by [`@dnd-kit`](https://dndkit.com/).

## 🚀 Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI / Shadcn UI
- **Interactions:** `@dnd-kit` (for Kanban board drag-and-drop)
- **Language:** TypeScript

## 📁 Folder Structure

```text
frontend/
├── app/                # Next.js App Router
├── components/         # React components
├── lib/                # Utility functions and API client
├── public/             # Static assets
├── .env.local          # Environment variables (not tracked)
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Setup & Installation

1. **Install Dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   # or yarn / pnpm / bun install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the `frontend` directory and add the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## 💻 Running the App

- **Development:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Production Build:**
  ```bash
  npm run build
  npm run start
  ```

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Runs ESLint to find and fix problems.
