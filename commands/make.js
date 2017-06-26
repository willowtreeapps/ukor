const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const log = require('../utils/log')
const properties = require('../utils/properties')
const mkdirp = require('mkdirp')
const fse = require('fs-extra')
const rimraf = require('rimraf')
const inserter = require('../utils/inserter')
const temp = '.ukor'

function moveToTempDir(flavor) {
  mkdirp(temp)
  if (properties.flavors.includes(flavor)) {
    fse.copySync(path.join(properties.sourceDir, flavor), temp, {
      filter: name => {
        if (
          name.endsWith('constants.yml') ||
          name.endsWith('constants.yaml') ||
          name.endsWith('.DS_Store') ||
          name.startsWith(`src/${flavor}/out`)
        ) {
          return false
        } else {
          return true
        }
      },
      overwrite: true
    })
  }
}

function bundleFlavor(options, callback) {
  const flavor = options.flavor || 'main'
  const build = options.build || properties.buildDir
  const include = options.include || []
  let name = options.name
  if (!name) name = ''
  rimraf.sync(temp)
  log.info('make flavor: ' + flavor)
  let zip = flavor + name + '.zip'
  mkdirp(build)
  var out = fs.createWriteStream(path.join(build, zip))
  var archive = archiver('zip')
  if (callback) {
    out.on('close', callback)
  }
  archive.pipe(out)
  var main = path.join(properties.sourceDir, properties.mainFlavor)
  var flavorDir = path.join(properties.sourceDir, flavor)
  let flavors = [main]
  include.forEach(inc => {
    flavors.push(path.join(properties.sourceDir, inc))
  })
  if (flavorDir != main) {
    flavors.push(flavorDir)
  }
  include.concat('main', flavor).forEach(flavor => {
    moveToTempDir(flavor)
  })
  inserter.compile(
    temp,
    inserter.mergeConstants(include.concat('main', flavor))
  )
  archive.glob('**/*', {
    cwd: temp
  })
  archive.finalize()
}

module.exports = {
  make: function(options, callback) {
    options.include = []
    bundleFlavor(options, callback)
  },
  makeAll: function(options, callback) {
    var count = 0
    options.include = []
    properties.flavors.forEach(flavor => {
      options.flavor = flavor
      bundleFlavor(options, () => {
        count++
        if (count == properties.flavors.length) {
          callback && typeof callback == 'function' ? callback() : null
        }
      })
    })
  },
  makeTest: function(options, callback) {
    options.include = ['test', 'test' + options.flavor]
    bundleFlavor(options, callback)
  }
}
