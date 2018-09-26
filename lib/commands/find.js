const ssdp = require('node-ssdp').Client
const log = require('../utils/log')
const request = require('request')
const properties = require('../utils/properties')
const xmlMatcher = /<(.*?)>(.*?)</g

function scan(timeout, callback) {
  log.info('searching for rokus for %d seconds...', timeout)
  var client = getSSDPClient()
  var rokus = {}
  client.on('response', function(headers, stats, rinfo) {
    let usn = headers.USN.replace('uuid:roku:ecp:', '')
    if (!rokus[usn]) {
      rokus[usn] = rinfo.address
      request.get(
        'http://' + rinfo.address + ':8060/query/device-info',
        (err, response, body) => {
          if (response) {
            let roku = {}
            roku[usn] = {}
            while ((match = xmlMatcher.exec(response.body))) {
              roku[usn][match[1]] = match[2]
            }
            log.info(
              `found %s : %s : ${rinfo.address}`,
              roku[usn]['model-name'],
              roku[usn]['serial-number']
            )
          }
        }
      )
    }
  })
  setTimeout(() => {
    log.info('finished')
  }, timeout * 1000)
  client.search('roku:ecp')
}

function usn(id, t, callback) {
  log.info('searching for %s for %d seconds...', id, t)
  var client = getSSDPClient()
  var roku = null
  client.on('response', function(headers, stats, rinfo) {
    log.pretty('debug', 'headers: ', headers)
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

function getSSDPClient() {
  return new ssdp({
    explicitSocketBind: true,
    unicastBindPort: 1900
  })
}

module.exports = {
  scan,
  usn
}
