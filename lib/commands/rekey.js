const fs = require('fs')
const request = require('request')
const log = require('../utils/log')
const properties = require('../utils/properties')

function rekey(options, ip) {
  var packageReferenceOverride = properties[options.packageConfig + ".packageReference"]
  var packageReference = packageReferenceOverride || properties.packageReference

  if (packageReference == null) {
    log.error("packageReference field is missing (ukor.properties)")
    return
  }

  var packageKeyOverride = properties[options.packageConfig + ".packageKey"]
  var packageKey = packageKeyOverride || properties.packageKey 

  if (packageKey == null) {
    log.error("packageKey field is missing (ukor.properties)")
    return
  }

  const form = {
    mysubmit: 'Rekey',
    passwd: packageKey,
    archive: fs.createReadStream(packageReference)
  }

  options.auth.sendImmediately = false
  request.post(
  {
    url: 'http://' + ip + '/plugin_inspect',
    formData: form,
    auth: options.auth
  },
  (error, response, body) => {
    if (error || !body) {
      log.error('Rekey device falied:')
      log.error(error)
    } else {
      result = parseBody(body)

      if (result[0].indexOf('Success') !== -1) {
        log.info(`The device was rekeyed with: ${packageKey}`)
      } else {
        log.error('Falied to rekey');
      }
    }
  }
  )
}

function parseBody(body) {
  return body.match(/<font color=\"red\">(.*?)<\/font>/g)
}

module.exports = {
  rekey
}
