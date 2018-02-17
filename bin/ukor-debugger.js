const telnet = require('../lib/commands/telnet')
const program = require('../lib/utils/log-commander')
const properties = require('../lib/utils/properties')
const log = require('../lib/utils/log')

program
  .arguments('[roku]')
  .option(
    '-r, --roku <name|id|ip>',
    'Specify a Roku. Ignored if passed as an argument'
  )
  .parse(process.argv)

let args = program.args
let roku = args[0] || properties.defaults.roku

if (!roku) {
  log.error('Must provide a Roku or IP to open')
}

telnet.debugger(roku)
