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
const gitBranch = require('git-branch')
const os = require('os')

const temp = '.ukor'

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

function getManifestFile(dir) {
  let manifestFilePath = path.join(dir, "manifest")
  try {
    let stats = fs.statSync(manifestFilePath)
    if (stats.isFile()) {
      return manifestFilePath
    } else {
      return null
    }
  } catch(err) {
    log.warn('Manifest file not found')
    return null
  }
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

function getVersionFromManifest(options) {
  var result = {
    majorVersion: '',
    minorVersion: '',
    buildVersion: ''
  }

  let manifestFile = getManifestFile(temp)
  let manifest = fs.readFileSync(manifestFile).toString()
  manifest.split(os.EOL).forEach(line => {
    let keyValuePair = line.split('=')
    if (keyValuePair[0] == 'major_version') {
      result.majorVersion = keyValuePair[1].trim()
    } else if (keyValuePair[0] == 'minor_version') {
      result.minorVersion = keyValuePair[1].trim()
    } else if (keyValuePair[0] == 'build_version') {
      result.buildVersion = keyValuePair[1].trim()
    }
  })
  return result
}

function getVersionStringFromManifest(options) {
  let version = getVersionFromManifest(options)
  return version.majorVersion + '.' + version.minorVersion + '.' + version.buildVersion
}

function getCurrentGitBranch() {
  try {
    return gitBranch.sync()
  } catch (e) {
    log.warn('Cannot get current git branch!')
    return 'nobranch'
  }
}

function getPackageFileName(options) {
  var packageFileName = properties[options.packageConfig + ".packageFileName"] || properties["packageFileName"] || options.flavor
  let version = utils.getVersionStringFromManifest(options)
  let gitBranch = utils.getCurrentGitBranch()

  packageFileName = packageFileName.replace('%flavor%', options.flavor)
  packageFileName = packageFileName.replace('%version%', version)
  packageFileName = packageFileName.replace('%branch%', gitBranch)
  
  return packageFileName
}

module.exports = {
  parseRoku,
  parseAuth,
  continueIfExists,
  getAllSourceFiles,
  getManifestFile,
  getDeviceInfo,
  getUsn,
  getVersionFromManifest,
  getVersionStringFromManifest,
  getCurrentGitBranch,
  getPackageFileName
}
