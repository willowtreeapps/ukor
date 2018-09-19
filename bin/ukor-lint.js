const log = require('../lib/utils/log')
const utils = require('../lib/utils/utils')
const lint = require('../lib/commands/lint')
const program = require('../lib/utils/log-commander')
const properties = require('../lib/utils/properties')

program
  .arguments('[flavor]')
  .parse(process.argv)

let args = program.args
let flavor = args[0] || properties.defaults['flavor']

if (flavor != null && flavor != '') {
  if (properties.isFlavor(flavor)) {
    let flavorSrc = [properties.sourceDir, flavor].join('/')
    lint.lint(flavorSrc, false)
  } else {
    log.error(`Flavor can't be found: ${flavor}`)
  }
}
