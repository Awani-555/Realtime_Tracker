const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: 'info', // default level
  format: combine(
    colorize(), // adds color to levels
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // logs to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // error file log
    new transports.File({ filename: 'logs/combined.log' }) // all logs
  ],
  exitOnError: false,
});

// Stream for morgan HTTP logging (optional)
logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;
