const fs = require('fs')
const path = require('path')
const log = require('./log')
const xml2js = require('xml2js')
const request = require('request')
const properties = require('./properties')
const matchers = {
  ip: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
  usn: /^[A-Z0-9]{12}$/
}

function getAllSourceFiles(dir) {
  let src = []
  let files = fs.readdirSync(dir)
  files.forEach(file => {
    let filepath = path.join(dir, file)
    let stats = fs.statSync(filepath)
    if (stats.isDirectory()) {
      src = src.concat(getAllSourceFiles(filepath))
    } else if (
      stats.isFile() && (filepath.endsWith('.brs') || filepath.endsWith('.xml'))
    ) {
      src.push(filepath)
    }
  })
  return src
}

function parseRoku(arg){
  if (Object.keys(properties.rokus).includes(arg)) {
    return 'name'
  } else if (arg.match(matchers.ip)) {
    return 'ip'
  } else if (arg.match(matchers.usn)) {
    return 'usn'
  } else {
    return null
  }
}

function parseAuth(auth) {
  var splits = auth.split(':')
  if (splits.length == 2) {
    return {
      user: splits[0],
      pass: splits[1]
    }
  }
  return null
}

function continueIfExists(object, message) {
  if (!object) {
    log.error(message)
    process.exit(-1)
  }
}

function getDeviceInfo(ip, callback) {
  request.get(`http://${ip}:8060/query/device-info`, (err, response, body) => {
    if (body) {
      xml2js.parseString(body, function (err, result) {
        callback ? callback(result['device-info']) : null
      })
    }
  })
}

function getUsn(options) {
  return (parseRoku(options.roku) == 'name') ? properties.rokus[options.roku].serial : options.roku
}

module.exports = {
  parseRoku,
  parseAuth,
  continueIfExists,
  getAllSourceFiles,
  getDeviceInfo,
  getUsn
}
