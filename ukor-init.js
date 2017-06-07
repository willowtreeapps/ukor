const fs = require('fs')
const log = require('./utils/log')
try {
  fs.mkdir('./src', () => {
    log.info('created ./src directory')
  })
  fs.mkdir('./src/main', () => {
    log.info('created ./src/main directory')
  })
  fs.mkdir('./src/test', () => {
    log.info('created ./src/main directory')
  })
} catch (e) {
  log.error(e.message)
}

let defaultProperties =
  'buildDir: build\n' +
  'sourceDir: src\n' +
  'mainFlavor: main\n'
project = fs.createWriteStream('./ukor.properties')
project.write(defaultProperties, () => {
  project.close()
  log.info('created ukor.properties')
})
