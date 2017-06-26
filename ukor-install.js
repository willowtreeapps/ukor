const install = require('./commands/install')
const program = require('./utils/log-commander')
const properties = require('./utils/properties')
const utils = require('./utils/utils')
const log = require('./utils/log')

program
  .arguments('[flavor] [roku]')
  .option(
    '-r, --roku <name|id|ip>',
    'Specify a roku. Ignored if passed as argument.'
  )
  .option('-a, --auth <user:pass>', 'Set username and password for roku.')
  .parse(process.argv)

let args = program.args
let flavor = args[0] || properties.defaults['flavor']
let roku = args[1] || program.roku || properties.defaults.roku
try {
  var auth = program.auth || properties.rokus[roku]['auth']
} catch (e) {
  log.error('no auth defined for roku: ' + roku)
  process.exit(-1)
}
let options = {
  flavor,
  roku,
  auth,
  name: ''
}
for (let key in options) {
  if (!options[key]) {
    log.error('%s options is undefined')
    log.pretty('error', 'options:', options)
    process.exit(-1)
  }
}

if (program['verbose']) {
  log.level = 'verbose'
}
if (program['debug']) {
  log.level = 'debug'
}
install.install(options)
