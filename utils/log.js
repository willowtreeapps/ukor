const winston = require('winston')
const pretty = require('prettyjson')
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  colorize: true,
})
winston.pretty = (level, msg, object) => {
  winston.log(level, msg + '\n%s', pretty.render(object))
}

module.exports = winston
