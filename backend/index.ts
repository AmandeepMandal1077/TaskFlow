import express from "express";
import type { Request, Response } from "express";
import prisma from "./lib/prisma";

const app = express();

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
app.listen(3001, () => {
    console.log("Server running on port 3001")
})