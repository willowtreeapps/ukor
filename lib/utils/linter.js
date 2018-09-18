const log = require('./log')
const wistLogger = require('./wist-logger')
const CLIEngine = require('@willowtreeapps/wist').CLIEngine

function run(sourceFiles, ignoreErrors) {
  try {
    const cliEngine = new CLIEngine()
    brsFiles = getBrsFiles(sourceFiles)

    let lint = cliEngine.executeOnFiles(brsFiles)
    wistLogger.logResult(lint.results, ignoreErrors)

    if (lint.errorCount > 0 && !ignoreErrors) {
      process.exit(-1)
    }
  } catch (e){
    log.warn(`Skipping Wist: ${e.message}`)
  }
}

function getBrsFiles(sourceFiles) {
  return sourceFiles.filter(file => file.endsWith('.brs'))
}

module.exports = {
  run
}
