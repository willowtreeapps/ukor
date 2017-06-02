const request = require('request')
const log = require('../utils/log')
const installer = require('./install')
const http = require('http')
const getIP = require('ip')

function runLogServer(ip, port, timeout, callback) {
  let logServer = http.createServer((req, res) => {
    let body = []
    req.on('data', data => {
      body.push(data)
    })
    req.on('end', () => {
      try {
        body = Buffer.concat(body).toString()
        let stats = JSON.parse(body)
        stats ? log.pretty('debug ', 'stats: ', stats) : log.info(stats)
        callback ? callback() : null
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
  logServer.listen(Number(port))
  return logServer
}

function runTests(ip, port, callback) {
  setTimeout(() => {
    let url = 'http://' + ip + ':8060/launch/dev?RunTests=true&host=' + getIP.address() + '&port=' + port
    log.verbose('starting tests with: %s', url)
    request.post(url, (err, response, body) => {
      if (response.statusCode != 200) {
        log.error('Error starting tests: %d', response.statusCode);
      } else {
        log.info('Tests started')
      }
      callback ? callback(response.statusCode != 200) : null
    })
  }, 3000)
}

module.exports = {
  test: (options, callback) => {
    installer.install(options, (ip, success) => {
      log.info('finished install, running tests')
      if (!success) return
      let port = options.port != '0' ? options.port : '8086'
      let server = runLogServer(ip, port, 5 * 60 * 1000, (results) => {
        //do something with results
      })
      runTests(ip, (success) => {
        if (!success) {
          server.close()
          process.exit(-1)
        }
      })
    })
  }
}
