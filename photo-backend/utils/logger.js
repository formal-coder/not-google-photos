const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.File({ filename: 'error.log' }),
        new transports.Console()
    ],
});

module.exports = logger;
