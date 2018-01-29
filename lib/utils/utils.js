const fs = require('fs')
const path = require('path')
const properties = require('./properties')
const log = require('./log')
const matchers = {
  ip: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
  usn: /^[A-Z0-9]{12}$/
}

module.exports = {
  parseRoku: (arg) => {
    if (Object.keys(properties.rokus).includes(arg)) {
      return 'name'
    } else if (arg.match(matchers.ip)) {
      return 'ip'
    } else if (arg.match(matchers.usn)) {
      return 'usn'
    } else {
      return null
    }
  },
  parseAuth: (auth) => {
    var splits = auth.split(':')
    if (splits.length == 2) {
      return {
        user: splits[0],
        pass: splits[1]
      }
    }
    return null
  },
  continueIfExists: (object, message) => {
    if (!object) {
      log.error(message)
      process.exit(-1)
    }
  }
}
