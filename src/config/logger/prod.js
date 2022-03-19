const { format, createLogger, transports } = require("winston");
const { combine, printf, json, label, timestamp, errors } = format;

const consoleFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp}\n[${label}] ${level}:\n${stack || message}\n`;
});

const { APP_NAME } = require("../env");

const logger = createLogger({
  format: combine(
    label({ label: APP_NAME }),
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new transports.Console({
      format: combine(consoleFormat),
    }),
    new transports.File({ filename: "errors.log", level: "error" }),
    new transports.File({ filename: "all-logs.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "unhandled-rejections.log" }),
  ],
});

module.exports = logger;
