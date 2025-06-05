import { createLogger, transports, format } from "winston";
import path from "path";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.simple()
  ),
  transports: [
    new transports.File({
      filename: path.resolve("logs/error.log"),
      level: "error",
      handleExceptions: true,
    }),
    new transports.Console({ level: "info" }),
  ],
  exitOnError: false,
});

export default logger;
