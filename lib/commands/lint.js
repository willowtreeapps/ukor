const log = require('../utils/log')
const utils = require('../utils/utils')
const linter = require('../utils/linter')

function lint(directory, ignoreErrors) {
  log.info('Getting source files')
  let sourceFiles = utils.getAllSourceFiles(directory)
  log.info('Run linter...')
  linter.run(sourceFiles, ignoreErrors)
}

module.exports = {
  lint
}
