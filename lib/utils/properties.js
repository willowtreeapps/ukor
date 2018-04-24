'use strict'

const fs = require('fs')
const merge = require('object-merge')
const yaml = require('js-yaml')
const ajv = new (require('ajv'))({
  useDefaults: true
})
const log = require('./log')
const pretty = require('prettyjson')
const schema = require('./schema')
let properties = null

function readProperties() {

  let normal = loadPropertiesFile()
  if (normal) {
    log.debug('ukor.properties:\n%s', pretty.render(normal))
    log.debug('reading ./ukor.local')
  }

  try {
    var local = yaml.safeLoad(fs.readFileSync('./ukor.local'))
  } catch (e) {
    log.warn('failed to read ./ukor.local')
  }

  if (local) {
    log.debug('ukor.local:\n%s', pretty.render(local))
    properties = merge(normal, local)
  } else {
    properties = normal || {}
  }
  let validate = ajv.compile(schema)
  let valid = validate(properties)
  if (!valid) {
    log.error('errors in properties')
    validate.errors.forEach(err => {
      log.error(err.dataPath + ' ' + err.message)
    })
  } else {
    log.debug('valid properties:\n%s', pretty.render(properties))
  }
  for (let f in properties.flavors) {
    if (properties.flavors[f].base) {
      properties.flavors[f].src = properties.flavors[properties.flavors[f].base].src.concat(properties.flavors[f].src)
    } else {
      properties.flavors[f].src = properties.flavors[f].src.reverse()
    }
  }
}
readProperties()
properties.isFlavor = flavor => {
  return Object.keys(properties.flavors).includes(flavor)
}

function loadPropertiesFile() {
  log.debug('reading ./ukor.properties...')

  function readPropertiesFile() {
    // ordered by preference
    if (fs.existsSync('./ukor.properties.yaml')) {
      return fs.readFileSync('./ukor.properties.yaml')
    } else if (fs.existsSync('./ukor.properties')) {
      return fs.readFileSync('./ukor.properties')
    }
  }  

  try {
    return yaml.safeLoad(readPropertiesFile())
  } catch (e) {
    log.error('failed to read ./ukor.properties')
    log.error(e.message)
  }
}

module.exports = properties
