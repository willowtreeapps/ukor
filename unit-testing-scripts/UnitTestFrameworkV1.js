const fs = require('fs')
const ip = require('ip')
const path = require('path')
const http = require('http')
const mkdirp = require('mkdirp')
const request = require('request')
const XMLWriter = require('xml-writer')
const child_process = require('child_process')

const args = process.argv.slice(2)

const ROKU_IP = args[0] // the roku device ip given as an argument by ukor
const LOG_SERVER_PORT = 8086

// main function call
main()

function main() {
    ipAddress = ip.address()

    runLogServer(ipAddress, LOG_SERVER_PORT)
    child_process.execSync(`curl -d '' "http://${ROKU_IP}:8060/launch/dev?RunTests=true&host=${ipAddress}&port=${LOG_SERVER_PORT}"`)
}

function runLogServer(ip, port, callback) {
  let logServer = http.createServer((req, res) => {
    let body = []
    req.on('data', data => {
      body.push(data)
    })
    req.on('end', () => {
      try {
        body = Buffer.concat(body).toString()
        let stats = JSON.parse(body)
        writeJunit(stats)
        if (stats) {
          console.log('------------')
          console.log('Test Results')
          console.log('Pass: %d | Fail: %d | Crash: %d', stats.correct, stats.fail, stats.crash)
          console.log('===================================')
          stats.suites.forEach(suite => {
            console.log('%s: %d tests', suite.name, suite.tests.length)
            suite.tests.forEach(test => {
              console.log('\t%s: %s', test.name, test.result)
              if (test.result != 'Success') console.log('\t\tError %d: %s', test.error.code, test.error.message)
            })
            console.log('---------------------------------')
          })
          console.log('Pass: %d | Fail: %d | Crash: %d', stats.correct, stats.fail, stats.crash)
          if (stats.fail > 0) process.exit(-1)
        }
        callback ? callback(stats) : null
        res.statusCode = '200'
      } catch (e) {
        log.error(e.message)
        res.statusCode = '403'
      }
      res.end('ok', () => {
        logServer.close()
      })
    })
  })

  logServer.listen(port, ip, () => {
    console.log('listening for tests on %s:%d', ip, port)
  })

  return logServer
}

function writeJunit(stats) {
  console.log('building junit xml')
  const xml = new XMLWriter()
  xml.startDocument()
  xml
    .startElement('testsuites')
    .writeAttribute('name', 'rokuTests')
    .writeAttribute('tests', '' + stats.total)
    .writeAttribute('failures', '' + stats.fail)
  stats.suites.forEach(suite => {
    xml
      .startElement('testsuite')
      .writeAttribute('name', suite.name)
      .writeAttribute('tests', '' + suite.total)
      .writeAttribute('failures', suite.fail)
      .writeAttribute('skipped', suite.skipped)
    suite.tests.forEach(test => {
      xml
        .startElement('testcase')
        .writeAttribute('name', test.name)
        .writeAttribute('time', '' + test.time * 0.001)
      if (test.result.toLowerCase() === 'fail') {
        xml
          .startElement('failure')
          .writeAttribute('type', '' + test.error.code)
          .text(test.error.message)
          .endElement()
      } else if (test.result.toLowerCase() === 'skipped') {
        xml
          .startElement('skipped')
          .endElement()
      }
      xml.endElement()
    })
    xml.endElement()
  })
  xml.endElement()
  xml.endDocument()
  const testOut = `./tests`
  mkdirp(testOut)
  console.log(`writing ${testOut}/ukorTests.xml and .junit`)
  fs.writeFileSync(path.join(testOut, 'ukorTests.junit'), xml.toString())
  fs.writeFileSync(path.join(testOut, 'ukorTests.xml'), xml.toString())
  console.log('successfully wrote junit xml')
}
