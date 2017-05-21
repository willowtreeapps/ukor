#!/usr/bin/env node

const program = require('commander')
const log = require('./utils/log')
const properties = require('./utils/properties')
const make = require('./commands/make')


program
  .arguments('[flavors...]')
  .option('-o, --out', 'Specify a different build directory')
  .parse(process.argv)

let args = program.args
var out = null
if (program['out']) {
  out = program['out']
}
if (args.length > 0) {
  args.forEach(flavor => {
    if (properties.isFlavor(flavor)) {
      make.make(flavor, out)
    } else {
      log.error('"' + flavor + '" is not a valid flavor')
    }
  })
} else {
  make.makeAll(out)
}
