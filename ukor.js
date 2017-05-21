#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const log = require('./utils/log')
var program = require('commander')

program
  .command('make [flavors...]',
    'Bundle your channel into a zip to the build directory')
  .command('install [flavor] [roku]',
    'Bundle then deploy your channel to a named roku')
  .command('package <flavor> <roku>',
    'Package a channel flavor with a roku device')
  .command('find', 'Search for rokus on the network')
  .command('validate', 'Validate ukor.properties and ukor.local')
  .option('-v, --verbose', 'Turn on verbose logging')
  .option('--debug', 'Turn on debug logging')
  .parse(process.argv)

if (program['verbose']) {
  log.level = 'verbose'
}
if (program['debug']) {
  log.level = 'debug'
}
