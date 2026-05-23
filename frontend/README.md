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

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles + Tailwind base imports
│   ├── layout.tsx                # Root layout, providers and shared UI
│   ├── loading.tsx               # App-level loading UI
│   ├── not-found.tsx             # 404 UI for the App Router
│   ├── page.tsx                  # Root/dashboard entry (route)
│   ├── board/                    # Dynamic route for boards
│   │   └── [id]/                 # Board page (server/client components as needed)
│   └── dashboard/                # Example nested route(s)
│       ├── loading.tsx
│       └── page.tsx
├── components/                   # Reusable React components
│   ├── navbar.tsx                # App navigation
│   ├── board/                    # Board-specific UI pieces
│   │   ├── board-canvas.tsx
│   │   ├── board-card.tsx
│   │   ├── board-column.tsx
│   │   ├── board-filter-panel.tsx
│   │   └── card-detail-dialog.tsx
│   ├── ui/                       # Low-level primitives and design-system pieces
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── ...                       # Additional component groups
├── lib/                          # App utilities, API clients and hooks
│   ├── utils.ts                  # Generic helpers (formatting, etc.)
│   ├── api/                      # Thin API client wrappers for backend endpoints
│   │   ├── apiClient.ts          # axios/fetch wrapper with auth headers
│   │   ├── board.ts              # Board-related requests
│   │   ├── card.ts
│   │   ├── label.ts
│   │   ├── types.ts
│   │   ├── user.ts
│   │   └── list.ts
│   └── hooks/                    # Client hooks for data fetching & state
│       ├── useBoards.ts
│       ├── useCardFilters.ts
│       └── useDebounce.ts
├── public/                       # Static assets (images, icons, fonts)
├── components.json               # Optional component metadata (used by design tools)
├── postcss.config.mjs            # PostCSS / Tailwind config entry
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Scripts and dependencies
├── .env                          # environment vars (not committed)
└── README.md                     # This file
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
   NEXT_PUBLIC_API_URL=http://localhost:3001
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
