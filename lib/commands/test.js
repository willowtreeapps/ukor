const request = require('request')
const log = require('../utils/log')
const installer = require('./install')
const utils = require('../utils/utils')
const properties = require('../utils/properties')

function runTestScript(script, execArgs) {
  log.info(`Running ${script} script with args ${execArgs}...`)
  utils.execScript(script, execArgs)
}

function test(options, callback) {
  installer.installTest(options, (ip, success) => {
    if (success) properties.runUnitTestsScript ? runTestScript(properties.runUnitTestsScript, [ip]) : log.error(`runUnitTestScript missing from properties`)
  })
}

module.exports = {
  test
}
