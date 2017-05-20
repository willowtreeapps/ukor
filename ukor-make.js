#!/usr/bin/env node

var program = require('commander')
var properties = require('./properties')
const make = require('./commands/make')


program
  .parse(process.argv)

console.log(program)
make.run(properties, process)

