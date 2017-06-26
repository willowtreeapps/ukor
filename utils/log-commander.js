const program = require('commander')
const log = require('./log')

program
  .option('-v, --verbose', 'Turn on verbose logging')
  .option('--debug', 'Turn on debug logging')
  .parse(process.argv)
if (program['verbose']) {
  log.level = 'verbose'
}
if (program['debug']) {
  log.level = 'debug'
}
module.exports = program
