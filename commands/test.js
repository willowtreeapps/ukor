const request = require('request')
const log = require('../utils/log')
const installer = require('./install')
const http = require('http')
const getIP = require('ip')

log.level = 'verbose'



module.exports = {
  test: (options, callback) => {
    installer.install(options, (ip, success) => {
      log.info('finished install, starting tests')
      if (!success) return
      let logServer = http.createServer((req, res) => {
        let body = []
        req.on('data', data => {
          body.push(data)
        })
        req.on('end', () => {
          try {
            body = Buffer.concat(body).toString()
            let stats = JSON.parse(body)
            stats ? log.pretty('info', 'stats: ', stats) : log.info(stats)
            res.statusCode = '200'
          } catch (e) {
            log.error(e.message)
            res.statusCode = '403'
          }
          res.end('ok', () => {
            log.info('shutting down server')
            logServer.close()
            log.info('done')
            process.exit(0)
          })
        })
      })
      logServer.listen(8086)
      let url = 'http://' + ip + ':8060/launch/dev?RunTests=true&host=' + getIP.address() + '&port=8086'
      log.info('url is %s', url)
      setTimeout(() => {
        request.post(url, (err, response, body) => {
          log.info(response.statusCode)
        })
      }, 3000)
    })
  }
}
