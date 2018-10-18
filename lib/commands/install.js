const request = require('request')
const fs = require('fs')
const make = require('./make')
const log = require('../utils/log')
const utils = require('../utils/utils')
const path = require('path')
const find = require('./find')
const properties = require('../utils/properties')

function upload(options, ip, callback) {
  const zip = path.join(
    properties.buildDir,
    options.flavor + options.name + '.zip'
  )
  const form = {
    mysubmit: 'replace',
    archive: fs.createReadStream(zip)
  }
  options.auth.sendImmediately = false
  request.post(
    {
      url: 'http://' + ip + '/plugin_install',
      formData: form,
      auth: options.auth
    },
    (err, response, body) => {
      if (err) {
        log.error(err)
      } else {
        let message = null
        let messageRegex = /\.trigger\('Set message content', '(.*?)'/g
        while ((message = messageRegex.exec(response.body))) {
          log.info(message[1])
        }
      }
      callback ? callback(ip, body != null) : null
    }
  )
}

function validateOptions(options) {
  if (
    options['roku'] &&
    options['flavor'] &&
    options['auth'] &&
    options['auth']['user'] &&
    options['auth']['pass']
  ) {
    if (properties.isFlavor(options.flavor) && utils.parseRoku(options.roku)) {
      return true
    }
  }
  log.pretty('error', 'cannot validate options: ', options)
  process.exit(-1)
  return false
}

function doInstall(test, options, callback) {
  let onmake = () => {
    if (utils.parseRoku(options.roku) == 'ip') {
      upload(options, options.roku, callback)
    } else {
      find.findDeviceBySerialNo(utils.getUsn(options), 5, ip => {
        ip ? upload(options, ip, callback) : null
      })
    }
  }
  if (test) {
    make.makeTest(
      { flavor: options.flavor, build: options.buildDir, name: options.name },
      onmake
    )
  } else {
    make.make(
      { flavor: options.flavor, build: options.buildDir, name: options.name },
      onmake
    )
  }
}

module.exports = {
  install: (options, callback) => {
    if (validateOptions(options)) {
      doInstall(false, options, callback)
    } else {
      callback ? callback('', false) : null
    }
  },
  installTest: (options, callback) => {
    if (validateOptions(options)) {
      doInstall(true, options, callback)
    } else {
      callback ? callback('', false) : null
    }
  }
}
