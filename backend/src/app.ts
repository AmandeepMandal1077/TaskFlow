import express from 'express'
import type { Express, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/ApiError.js';
import dotenv from 'dotenv'
import boardRoutes from './modules/board/board.route.js';
import prisma from './lib/prisma.js';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//health check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        database: "connected",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        database: "disconnected",
      },
    });
  }
});

// Feature routes
app.use('/api/boards', boardRoutes);

// Unknown routes handler
app.use((req: Request, res: Response, next) => {
  next(new ApiError(404, 'Not found'));
});

// Error handling
app.use(errorHandler);

export default app;
