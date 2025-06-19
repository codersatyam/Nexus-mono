const winston = require('winston');

const colors = {
  info: 'green',
  error: 'red',
  warn: 'yellow',
  debug: 'cyan'
};


winston.addColors(colors);

const logger = winston.createLogger({
  level: 'info',  // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(),  // Add timestamps to the logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Output logs to the console
    new winston.transports.File({ filename: 'app.log' }) // Output logs to a file
  ]
});




module.exports = logger;