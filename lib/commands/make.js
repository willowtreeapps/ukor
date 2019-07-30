const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const fse = require('fs-extra')
const rimraf = require('rimraf')
const log = require('../utils/log')
const archiver = require('archiver')
const utils = require('../utils/utils')
const inserter = require('../utils/inserter')
const properties = require('../utils/properties')
const temp = '.ukor'

function moveToTempDir(flavor) {
  mkdirp(temp)
  if (fs.existsSync(flavor)) {
    fse.copySync(flavor, temp, {
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
  if (properties.preBuild) utils.execScript(properties.preBuild)

  const flavor = options.flavor
  let flavorSrc = properties.flavors[flavor].src
  const build = options.build || properties.buildDir
  const include = options.include || []
  flavorSrc = include.concat(flavorSrc)
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
  let flavors = []
  flavorSrc.forEach(inc => {
    flavors.push(path.join(properties.sourceDir, inc))
  })
  flavors.forEach(moveToTempDir)
  inserter.compile(
    temp,
    inserter.mergeConstants(flavors)
  )
  var out = fs.createWriteStream(path.join(build, zip))
  var archive = archiver('zip')
  if (callback) {
    out.on('close', callback)
  }
  archive.pipe(out)
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
    for(flavor in properties.flavors){
      options.flavor = flavor
      bundleFlavor(options, () => {
        count++
        if (count == Object.keys(properties.flavors).length) {
          callback && typeof callback == 'function' ? callback() : null
        }
      })
    }
  },
  makeTest: function(options, callback) {
    options.include = ['test', 'test' + options.flavor]
    bundleFlavor(options, callback)
  }
}
