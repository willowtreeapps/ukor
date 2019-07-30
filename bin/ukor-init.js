'use strict'
const path = require('path')
const fs = require('fs-extra')
const log = require('../lib/utils/log')
const yaml = require('js-yaml')

try {
  fs.copySync(path.resolve(__dirname, '../lib/sample'), './', {
    overwrite: false,
    errorOnExist: false
  })
  log.info('created src directory')
} catch (e) {
  log.error('failed to create src directory')
  log.error(e)
}

log.info('Ukor works greate with Wist, run "wist -i" to generate a default .wistrc.json')
