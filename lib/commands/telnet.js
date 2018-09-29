const utils = require('../utils/utils')
const find = require('./find')
const log = require('../utils/log')
const properties = require('../utils/properties')
const { spawn } = require('child_process')

function findRokuAndExecute(roku, callback) {
  let rokuType = utils.parseRoku(roku)
  if (rokuType== 'ip') {
    callback(roku)
  } else {
    let usn = ''
    if (rokuType == 'name') {
      usn = properties.rokus[roku].serial
    } else {
      usn = roku
    }
    find.findDeviceBySerialNo(usn, 5, ip => {
      if (ip) {
        callback(ip)
      } else {
        log.error('Unable to find Roku %s', roku)
      }
    })
  }
}

function openTelnet(ip, port) {
  spawn('telnet', [ip, port], {
    detached: true,
    stdio: 'inherit'
  })
}

function openConsole(ip) {
  openTelnet(ip, 8085)
}

function openDebugger(ip) {
  openTelnet(ip, 8080)
}

module.exports = {
  console: (roku) => {
    findRokuAndExecute(roku, openConsole)
  },
  debugger: (roku) => {
    findRokuAndExecute(roku, openDebugger)
  }
}
