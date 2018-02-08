#!/usr/bin/env node

const program = require('../lib/utils/log-commander')
const log = require('../lib/utils/log')
const properties = require('../lib/utils/properties')
const make = require('../lib/commands/make')

program
  .arguments('[flavors...]')
  .option('-o, --out <out>', 'Specify a different build directory')
  .option('-l, --label <name>', 'Append a string to the zip name')
  .option('-i, --ignore-errors', 'Don\'t fail the build if linting errors are found')
  .parse(process.argv)

let args = program.args
let build = program.out || properties.buildDir
let name = program.label || ''
let ignoreErrors = program.ignoreErrors || false
let options = { build, name, ignoreErrors }

if (args.length > 0) {
  args.forEach(flavor => {
    if (properties.isFlavor(flavor)) {
      options.flavor = flavor
      make.make(options, () => {})
    } else {
      log.error(`"${flavor}" is not a valid flavor`)
    }
  })
} else {
  log.info('make all')
  make.makeAll(options, () => {})
}
