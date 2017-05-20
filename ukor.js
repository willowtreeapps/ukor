#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
var program = require('commander')

program
  .command('make [flavor]', 'Bundle your channel into a zip to the build directory')
  .command('install [flavor] [roku]', 'Bundle then deploy your channel to a named roku')
  .command('package <flavor> <roku>', 'Package a channel flavor with a roku device')
  .command('find', 'Search for rokus on the network')
  .parse(process.argv)

function chooseCommand(cmd, flavor, roku) {
  console.log(program)
  console.log(flavor)
}
