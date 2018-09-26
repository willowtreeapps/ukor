const log = require('../lib/utils/log')
const utils = require('../lib/utils/utils')
const find = require('../lib/commands/find')
const program = require('../lib/utils/log-commander')

program
  .arguments('[id]')
  .option('-t, --timeout <seconds>', 'Time to scan in seconds')
  .parse(process.argv)

let t = 5
if (program['timeout']) {
  t = program.timeout
}

if (program.args.length == 0) {
  find.scan(t, ipAddress => {
    utils.getDeviceInfo(ipAddress, device => {
        log.info(`found ${device['model-name']} : ${device['serial-number']} : ${ipAddress}`)
    })
  })
} else {
  find.findDeviceBySerialNo(program.args[0], t)
}
