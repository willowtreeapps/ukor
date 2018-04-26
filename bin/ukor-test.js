const tester = require('../lib/commands/test')
const log = require('../lib/utils/log')
const program = require('../lib/utils/log-commander')
const utils = require('../lib/utils/utils')
const properties = require('../lib/utils/properties')

program
  .arguments('[flavor] [roku]')
  .option(
    '-p, --port <port>',
    'Specify a port for ukor to receive the test results'
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
if (args.length > 1) {
  options.roku = args[1]
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
