const request = require('request')
const fs = require('fs')
const make = require('./make')
const log = require('../utils/log')
const utils = require('../utils/utils')
const path = require('path')
const find = require('./find')


function upload(options, ip) {
  let zip = path.join(properties.buildDir, options.flavor + '.zip')
  let form = {
    mysubmit: 'replace',
    archive: fs.createReadStream(zip)
  }
  options.auth.sendImmediately = false
  request.post({
    url: 'http://' + ip + '/plugin_install',
    formData: form,
    'auth': options.auth
  }, (err, response, body) => {
    if (err) {
      log.error(err)
    } else {
      var message = null
      var messageRegex = /\.trigger\('Set message content', '(.*?)'/g
      while (message = messageRegex.exec(response.body)) {
        log.info(message[1])
      }
    }
  })
}

function validateOptions(options) {
  if (options['roku'] && options['flavor'] && options['auth'] && options['auth']
    ['user'] && options['auth']['user']) {
    if (properties.isFlavor(options.flavor) && utils.parseRoku(options.roku)) {
      return true
    }
  }
  log.pretty('error', 'cannot validate options: ', options)
  return false
}


module.exports = {
  install: (options) => {
    if (validateOptions(options)) {
      make.make(options.flavor, null, () => {
        if (utils.parseRoku(options.roku) == 'ip') {
          upload(options, options.roku)
        } else {
          var usn = ''
          if (utils.parseRoku(options.roku) == 'name') {
            usn = properties.rokus[options.roku].id
          } else {
            usn = options.roku
          }
          find.usn(usn, 5, (ip) => {
            ip ? upload(options, ip) : log.error(
              'unable to find roku on network')
          })
        }
      })
    }
  }
}
