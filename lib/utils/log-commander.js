const program = require('commander')
const log = require('./log')

program
  .option('-v, --verbose', 'Turn on verbose logging')
  .option('--debug', 'Turn on debug logging')

let parser = program.parse

program.__proto__.parse = function parse() {
  parser.call(program, process.argv)

  if (program['verbose']) {
    log.level = 'verbose'
  }
  
  if (program['debug']) {
    log.level = 'debug'
  }
}

module.exports = program
