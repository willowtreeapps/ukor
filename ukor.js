#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const log = require('./utils/log')
const program = require('commander')

program
  .command(
    'make [flavors...]',
    'Bundle your channel into a zip to the build directory'
  )
  .command(
    'install [flavor] [roku]',
    'Bundle then deploy your channel to a named roku'
  )
  .command(
    'package <flavor> <roku>',
    'Package a channel flavor with a roku device'
  )
  .command('find', 'Search for rokus on the network')
  .command('init [flavors...]', 'Initialize a ukor project')
  .command('test', 'Run the tests')
  .command('validate', 'Validate ukor.properties and ukor.local')
  .parse(process.argv)
