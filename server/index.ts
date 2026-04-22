import "dotenv/config";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import listingsRouter from "./routes/listings";
import myListingsRouter from "./routes/my-listings";
import messagesRouter from "./routes/messages";
import authRouter, { getUserIdFromToken } from "./routes/auth";
import type { IncomingMessage, ServerResponse } from "http";

// Initialize Prisma Client - will be initialized when dependencies are installed
let prisma: any = null;

try {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
} catch (e) {
  console.warn("Prisma Client not installed. Install with: pnpm install @prisma/client");
}

export { prisma };

/**
 * Creates a connect-compatible middleware that only handles /api/* requests.
 * Non-API requests fall through to Vite's own middleware (serving index.html, static assets, etc).
 */
export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth middleware — extract token and resolve userId
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      (req as any).token = token;
      // Resolve userId from token
      const userId = getUserIdFromToken(token);
      if (userId) {
        (req as any).userId = userId;
      }
    }
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // API Routes
  app.use("/api/auth", authRouter);
  app.use("/api/listings", listingsRouter);
  app.use("/api/my-listings", myListingsRouter);
  app.use("/api/messages", messagesRouter);

  // 404 handler for unmatched API routes
  app.all("/api/{*path}", (_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Global error handling middleware
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Prisma unique constraint violation
    if (err.code === "P2002") {
      return res.status(400).json({
        error: `${err.meta?.target?.[0] || "Field"} already exists`,
        statusCode: 400,
      });
    }

    // Prisma validation error
    if (err.code === "P2025") {
      return res.status(404).json({
        error: "Record not found",
        statusCode: 404,
      });
    }

    // Zod validation error
    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        statusCode: 400,
        details: err.errors,
      });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid or expired token",
        statusCode: 401,
      });
    }

    // Default error response
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal server error",
      statusCode: err.statusCode || 500,
    });
  };

  app.use(errorHandler);

  // Return a connect-compatible middleware that only processes /api requests.
  // Non-API requests are passed through to the next middleware (Vite).
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url && req.url.startsWith("/api")) {
      app(req, res);
    } else {
      next();
    }
  };
}
