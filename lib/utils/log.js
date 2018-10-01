const winston = require('winston')
const pretty = require('prettyjson')

let logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

logger.pretty = (level, msg, object) => {
  logger.log(level, msg + '\n%s', pretty.render(object))
}

module.exports = logger
