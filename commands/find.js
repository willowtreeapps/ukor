const ssdp = require('node-ssdp').Client
const log = require('../utils/log')
const properties = require('../utils/properties')

module.exports = {
  scan: (timeout, callback) => {
    log.info('searching for rokus for %d seconds...', timeout)
    var client = new ssdp()
    var rokus = {}
    client.on('response', function(headers, stats, rinfo) {
      var usn = headers.USN.replace('uuid:roku:ecp:', '')
      if (!rokus[usn]) {
        rokus[usn] = rinfo.address
        log.info('found roku: %s at %s', usn, rinfo.address)
      }
    })
    setTimeout(() => {
      log.info('finished')
    }, timeout * 1000)
    client.search('roku:ecp')
  },
  usn: (id, t, callback) => {
    log.info('searching for %s for %d seconds...', id, t)
    var client = new ssdp()
    var roku = null
    client.on('response', function(headers, stats, rinfo) {
      if (!roku && headers.USN == 'uuid:roku:ecp:' + id) {
        log.info('found roku: %s at %s', id, rinfo.address)
        roku = rinfo.address
        callback ? callback(roku) : null
      }
    })
    setTimeout(() => {
      if (!roku) {
        log.error('find roku failed')
        callback ? callback(null) : null
      }
    }, t * 1000)
    client.search('roku:ecp')
  }
}
