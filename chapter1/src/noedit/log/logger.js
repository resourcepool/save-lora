const winston = require('winston');
const conf = require('../../conf');

const logger = winston.createLogger({
  level: conf.logger.level,
  format: winston.format.json()
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) ` 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
