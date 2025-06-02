import logger from './logger.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} – ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
}
