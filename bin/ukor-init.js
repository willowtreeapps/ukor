'use strict'
const path = require('path')
const fs = require('fs-extra')
const log = require('../lib/utils/log')
const yaml = require('js-yaml')

try {
  fs.copySync(path.resolve(__dirname, '../lib/sample'), './', {
    overwrite: false, 
    errorOnExist: false
  })
  log.info('created src directory')
} catch (e) {
  log.error('failed to create src directory')
  log.error(e)
}
  
const propsFile = './ukor.properties.yaml'
if (!fs.existsSync(propsFile)) {
  const project = fs.createWriteStream(propsFile)	
  const defaults = {
    name: path.basename(process.cwd()), 
    version: '0.0.1',
    buildDir: 'build',
    sourceDir: 'src',
    defaults: {
      flavor: 'main'
    }, 
    flavors: {
      main: {
        src: ['main']
      }
    } 
  }
  project.write(yaml.safeDump(defaults), () => {	
    project.close()	
    log.info(`created ${propsFile}`)	
  })
} else {
  log.info(`${propsFile} already exists`)
}

log.info('Ukor works greate with Wist, run "wist -i" to generate a default .wistrc.json')

