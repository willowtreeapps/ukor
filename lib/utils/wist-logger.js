'use strict'

const log = require('./log')
const EOL = require('os').EOL

function isError(message) {
  if (message.fatal || message.severity === 2) {
    return true
  }

  return false
}

module.exports = {
  logResult(results, ignoreErrors) {
    log.debug('ignore errors:', ignoreErrors)

    let errorTotal = 0,
      warningTotal = 0

    results.forEach(result => {
      const messages = result.messages

      errorTotal += messages.filter(m => isError(m)).length
      warningTotal += messages.filter(m => !isError(m)).length

      messages.forEach(message => {
        let output = `${result.filePath}(${message.line || 0},${message.column || 0}): ${message.message}`
        output += message.ruleId ? ` [${message.ruleId}]` : ''

        if (isError(message)) {
          log.error(output)
        }
        else {
          log.warn(output)
        }
      })
    })

    let summary,
      logger

    if (errorTotal > 0 && ignoreErrors !== true) {
      summary = `FAILED.${EOL}`
      logger = log.error
    }
    else {
      summary = 'Succeed'

      if (errorTotal > 0 && ignoreErrors === true) {
        summary += ', with ignored errors'
      }

      summary += `.${EOL}`

      logger = log.info
    }

    summary += `\t${warningTotal} Warning(s)${EOL}`
    summary += `\t${errorTotal} Error(s)${EOL}`

    logger(summary)
  }
}