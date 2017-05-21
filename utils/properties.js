const path = require('path')
const fs = require('fs')
const merge = require('object-merge')
const yaml = require('js-yaml')
const ajv = new(require('ajv'))({
  useDefaults: true
})
const log = require('./log')
const pretty = require('prettyjson')
const schema = require('./schema')

function readProperties() {
  log.verbose('reading ./ukor.properties...')
  try {
    var normal = yaml.safeLoad(fs.readFileSync('./ukor.properties'))
  } catch (e) {
    log.error('failed to read ./ukor.properties')
    log.error(e.message)
  }
  log.verbose('ukor.properties:\n%s', pretty.render(normal))
  log.verbose('reading ./ukor.local')
  try {
    var local = yaml.safeLoad(fs.readFileSync('./ukor.local'))
  } catch (e) {
    log.error('failed to read ./ukor.local')
    log.error(e.message)
  }
  log.verbose('ukor.local:\n%s', pretty.render(local))
  properties = merge(normal, local)
  var validate = ajv.compile(schema)
  var valid = validate(properties)
  if (!valid) {
    log.error('errors in properties')
    validate.errors.forEach(err => {
      log.error(err.dataPath + ' ' + err.message)
    })
  } else {
    log.verbose('valid properties:\n%s', pretty.render(properties))
  }
  properties.flavors = getFlavors()
}

function getFlavors() {
  var flavors = []
  try {
    fs.readdirSync(properties.sourceDir).forEach(file => {
      if (file !== 'main' && fs.lstatSync(path.join(properties.sourceDir,
          file)).isDirectory()) {
        flavors.push(file)
      }
    })
  } catch (e) {
    log.error('sourceDir: %s not found', properties.sourceDir)
  }
  return flavors
}
readProperties()
properties.isFlavor = (flavor) => {
  return (properties.flavors.includes(flavor))
}

module.exports = properties
