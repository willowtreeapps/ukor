const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const log = require('../utils/log')
const properties = require('../utils/properties')
const mkdirp = require('mkdirp')

function bundleFlavor(flavor, build, callback) {
  const name = flavor
  const thisCallback = callback
  build = build ? build : properties.buildDir
  log.verbose('make flavor: ' + flavor)
  let zip = flavor + '.zip'
  mkdirp(build)
  var out = fs.createWriteStream(path.join(build, zip))
  var archive = archiver('zip')
  out.on('close', () => {
    log.info('finished making %s', name)
    thisCallback()
  })
  archive.pipe(out)
  var main = path.join(properties.sourceDir, properties.mainFlavor)
  var flavorDir = path.join(properties.sourceDir, flavor)
  archive.glob('{!(out)/**,!(out)}', {
    cwd: main,
  })
  archive.glob('{!(out)/**,!(out)}', {
    cwd: flavorDir
  })
  archive.finalize()
}

module.exports = {
  make: function(flavor, build, callback) {
    bundleFlavor(flavor, build, callback)
  },
  makeAll: function(build, callback) {
    var count = 0;
    properties.flavors.forEach(flavor => {
      bundleFlavor(flavor, build, () => {
        count++
        if (count == properties.flavors.length) {
          callback && typeof(callback) == 'function' ? callback() :
            null
        }
      })
    })
  }
}
