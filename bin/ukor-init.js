'use strict'

const path = require('path')
const fs = require('fs')
const log = require('../lib/utils/log')
try {
  fs.mkdir('./src', () => {
    log.info('created ./src directory')
  })
  fs.mkdir('./src/main', () => {
    log.info('created ./src/main directory')
  })
  fs.mkdir('./src/test', () => {
    log.info('created ./src/main directory')
  })
} catch (e) {
  log.error(e.message)
}

let defaultProperties =
  'name: '+ path.basename(process.cwd()) +'\n' +
  'version: 0.0.1\n' +
  'buildDir: build\n' +
  'sourceDir: src\n' +
  'mainFlavor: main\n'

const localProperties = fs.createWriteStream('./ukor.local')
localProperties.write('', () => {
  localProperties.close()
  log.info('Created ukor.local')
})

const project = fs.createWriteStream('./ukor.properties.yaml')
project.write(defaultProperties, () => {
  project.close()
  log.info('created ukor.properties.yaml')
})
