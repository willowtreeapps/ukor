'use strict'
const path = require('path')
const fs = require('fs')
const log = require('../lib/utils/log')
const yaml = require('js-yaml')
try {
  fs.mkdir('./src', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('created ./src directory')
  })
  fs.mkdir('./src/main', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('created ./src/main directory')
  })
  fs.mkdir('./src/test', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('created ./src/test directory')
  })
  fs.mkdir('./src/test/source', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('created ./src/test/source directory')
  })
  fs.copyFile(path.resolve(__dirname, '../lib/raw/UnitTestFramework.brs'), './src/test/source/UnitTestFramework.brs', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('copied UnitTestFramework.brs to ./src/test/source/')
  })
  fs.copyFile(path.resolve(__dirname, '../lib/raw/default.properties'), './src/test/source/ukor.properties', (err) => {
    if (err && err.code !== 'EEXIST') throw err
    log.info('copy default properties to ukor.properties')
  })
  
  const project = fs.createWriteStream('./ukor.properties.yaml')	
  const defaults = {
    name: path.basename(process.cwd()), 
    version: '0.0.1',
    buildDir: 'build',
    sourceDir: 'src',
    mainFlavor: 'main', 
    flavors: {
      main: {
        src: ['main']
      }
    } 
  }
  project.write(yaml.safeDump(defaults), () => {	
    project.close()	
    log.info('created ukor.properties.yaml')	
 })

} catch (e) {
  log.error(e.message)
}

