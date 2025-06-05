import logger from "../utilities/logger.mjs";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Logga felet med Winston
  logger.error(
    `${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    } - ${message}`
  );
  if (err.stack) {
    logger.error(err.stack);
  }

  // Skicka tillbaka statuskod till klienten
  res.status(statusCode).json({ status: "error", message });
}
