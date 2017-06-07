const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const log = require('../utils/log')
const properties = require('../utils/properties')
const mkdirp = require('mkdirp')

function bundleFlavor(flavor, include, build, callback) {
  const name = flavor
  const thisCallback = callback
  build = build ? build : properties.buildDir
  log.verbose('make flavor: ' + flavor)
  let zip = flavor + '.zip'
  mkdirp(build)
  var out = fs.createWriteStream(path.join(build, zip))
  var archive = archiver('zip')
  out.on('close', callback)
  archive.pipe(out)
  var main = path.join(properties.sourceDir, properties.mainFlavor)
  var flavorDir = path.join(properties.sourceDir, flavor)
  let flavors = [main]
  include.forEach(inc => {
    flavors.push(path.join(properties.sourceDir, inc))
  })
  if(flavorDir != main){
    flavors.push(flavorDir)
  }
  addFlavors(flavors, archive)
  archive.finalize()
}

function addFlavors(flavors, archive){
  flavors.forEach(flavor => {
    archive.glob('{!(out)/**,!(out)}', {
      cwd: flavor
    })
  })
}

module.exports = {
  make: function(flavor, build, callback) {
    bundleFlavor(flavor, [], build, callback)
  },
  makeAll: function(build, callback) {
    var count = 0;
    properties.flavors.forEach(flavor => {
      bundleFlavor(flavor, [], build, () => {
        count++
        if (count == properties.flavors.length) {
          callback && typeof(callback) == 'function' ? callback() :
            null
        }
      })
    })
  },
  makeTest: function(flavor, build, callback) {
    bundleFlavor(flavor, ['test', 'test'+flavor], build, callback)
  }
}
