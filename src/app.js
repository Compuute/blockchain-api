// src/app.js

import express from "express";
import "express-async-errors";
import blockRoutes from "./routes/blockRoutes.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import logger from "./utilities/logger.mjs";

const app = express();

// Middleware
app.use(express.json());

// Centraliserad loggning
app.use((req, res, next) => {
  logger.info(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Koppla på block‐routes under /api/blocks
app.use("/api/blocks", blockRoutes);

// 404‐hantering för endpoints som inte finns
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Endpoint hittades inte" });
});

// Centraliserad felhantering
app.use(errorHandler);

export default app;
