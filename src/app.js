import express from "express";
import blockRoutes from "./src/routes/blockRoutes.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import "express-async-errors";
import logger from "./src/utils/logger.js";

const app = express();

// Middleware: parsa JSON bodies in requests
app.use(express.json());

// Centraliserad loggning av alla förfrågningar
app.use((req, res, next) => {
    logger.info(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Koppla på block-routes
app.use('/api", blockRoutes);


// 404-hantering för endpoints som inte finns.
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Endpoint hittades inte'});
});

// Centraliserad felhantering...
app.use(errorHandler);

export default app;

