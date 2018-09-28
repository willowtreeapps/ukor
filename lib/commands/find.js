const ssdp = require('node-ssdp')
const log = require('../utils/log')

function scan(timeout, callback) {
  log.info('searching devices for %d seconds...', timeout)
  var client = getSSDPClient()

  client.on('response', function(headers, stats, rinfo) {
      log.pretty('debug', 'headers: ', headers)
      callback ? callback(rinfo.address, headers) : null
  })

  setTimeout(() => {
    log.debug('scan: TIMEOUT')
  }, timeout * 1000)
  client.search('roku:ecp')
}

function findDeviceBySerialNo(deviceSerialNo, timeout, callback) {
  scan(timeout, (ipAddress, headers) => {
    if (headers.USN == `uuid:roku:ecp:${deviceSerialNo}`) {
      log.info('found roku: %s at %s', deviceSerialNo, ipAddress)

      callback ? callback(ipAddress) : null
    }
  })
}

function getSSDPClient() {
  return new ssdp.Client({
    explicitSocketBind: true,
    unicastBindPort: 1900
  })
}

module.exports = {
  scan,
  findDeviceBySerialNo
}
