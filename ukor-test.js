const tester = require('./commands/test')
const log = require('./utils/log')
const program = require('./utils/log-commander')
const utils = require('./utils/utils')
const properties = require('./utils/properties')

program
  .arguments('[flavor] [roku]')
  .option(
    '-e, --external <url>',
    'Send test result json to something other than ukor'
  )
  .option(
    '-p, --port <port>',
    'Specify a port for ukor to recieve the test results'
  )
  .option('-a, --auth <user:pass>', 'Set username and password for roku.')
  .option(
    '-r, --roku <name|id|ip>',
    'Specify a roku. Ignored if passed as argument.'
  )
  .parse(process.argv)

let args = program.args
let options = {
  flavor: properties.defaults['flavor'],
  roku: properties.defaults['roku'],
  auth: null,
  port: '8080',
  url: null,
  name: '_test'
}
if (program['flavor']) {
  options.flavor = program.flavor
}
if (args.length > 0) {
  options.flavor = args[0]
}
if (options.flavor == null || options.flavor == '') {
  log.error('no flavor selected')
}
if (program['port']) {
  options.port = program.port
}
if (program['roku']) {
  options.roku = program.roku
}
if (
  options.roku == null ||
  options.roku === '' ||
  utils.parseRoku(options.roku) == null
) {
  log.error('No roku selected')
}
if (
  utils.parseRoku(options.roku) === 'name' &&
  Object.keys(properties.rokus).includes(options.roku)
) {
  options.auth = properties.rokus[options.roku].auth
}
if (program['auth']) {
  options.auth = utils.parseAuth(program.auth)
}
if (!options.auth) {
  log.error('No auth for roku')
}
if (options.auth == null) {
  log.error('no auth given')
}
tester.test(options, () => {})
