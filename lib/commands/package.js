const fs = require('fs')
const path = require('path')
const request = require('request')
const log = require('../utils/log')
const properties = require('../utils/properties')

function create(options, ip) {
  const curTime = new Date().getTime();

  const zip = path.join(
    properties.buildDir,
    options.flavor + options.name + '.zip'
  )
  const form = {
    app_name: getAppName(options),
    mysubmit: 'Package',
    pkg_time: curTime,
    passwd: properties.packageKey
  }

  request.post(
    {
      url: 'http://' + ip + '/plugin_package',
      formData: form,
      auth: options.auth
    },
    (error, response, body) => {
      if (error || !body) {
        log.error('Generate package failed:')
        log.error(error)
        log.error('Failture http code:' + response.statusCode)
      } else {
        urls = parseBody(body)

        if (urls) {
          packageName = getPackageName(urls)
          if (packageName != null) {
            download(options, ip, packageName)
          }
        } else {
          log.error('Falied to find the package in body response');
        }
      }
    }
  )
}

function parseBody(body) {
  return body.match(/<a href=(.*?)>/g)
}

function download(options, ip, packageName) {
  request.get(
    {
      url: 'http://' + ip + '/' + packageName,
      auth: options.auth
    },
    (error, response, body) => {
      if (error || !body) {
        log.error('Download package failed:')
        log.error(error)
        log.error('Failture http code:' + response.statusCode)
      } else {
        log.verbose('Package was founded on roku device')
        log.info('Creating package...')
      }
    }
  ).pipe(fs.createWriteStream(properties.buildDir + '/release.pkg'))
}

function getPackageName(urls) {
  let result = null

  urls.map(function(val) {
    result = val.split('"')[1];
  })

  return result
}

function getAppName(options) {
  return [
    properties.name,
    options.flavor
  ].join('/')
}

module.exports = {
  package: (options, ip) => {
    create(options, ip)
  }
}
