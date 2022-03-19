const { format, createLogger, transports } = require("winston");
const { APP_NAME } = require("../env");
const { combine, timestamp, label, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, label, timestamp, stack }) => {
  message = message.replace(/[[\d]+m/g, "");
  return `${timestamp}\n[${label}] ${level}:\n${stack || message}\n`;
});

const consoleFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp}\n[${label}] ${level}:\n${stack || message}\n`;
});

const logger = createLogger({
  format: combine(
    label({ label: APP_NAME }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
    new transports.File({ filename: "errors.log", level: "error" }),
    new transports.File({ filename: "all-logs.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "unhandled-rejections.log" }),
  ],
});

module.exports = logger;
