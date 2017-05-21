const install = require('./commands/install')
const program = require('commander')
const properties = require('./utils/properties')
const utils = require('./utils/utils')
const log = require('./utils/log')

program.arguments('[flavor] [roku]')
  .option('-r, --roku <name|id|ip>',
    'Specify a roku. Ignored if passed as argument.')
  .option('-a, --auth <user:pass>', 'Set username and password for roku.')
  .parse(process.argv)

let args = program.args
let options = {
  flavor: properties.defaults['flavor'],
  roku: properties.defaults['roku'],
  auth: null
}
if (args.length > 0) {
  options.flavor = args[0]
}
if (!options['flavor']) {
  log.error('No flavor specified!')
  process.exit(-1)
}
if (program['roku']) {
  options.roku = program['roku']
}
if (args.length > 1) {
  options.roku = args[1]
}
if (!options['roku']) {
  log.error('No roku specified!')
  process.exit(-1)
}
if (program['auth']) {
  options.auth = utils.parseAuth(program.auth)
} else {
  try {
    options.auth = properties.rokus[options.roku]['auth']
  } catch (e) {
    log.error('cannot find auth for roku: %s', options.roku)
    process.exit(-1)
  }
}
if (!options['auth']) {
  log.error('invalid auth option: %s', program.auth)
  process.exit(-1)
}
install.install(options)
