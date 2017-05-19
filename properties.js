const path = require('path')
const fs = require('fs')
const build = './build.ukor'
const props = './ukor.properties'
const propsLocal = './ukor.local'

function readProperties() {
  try {
    var propsFile = fs.readFileSync(props)
    var propsJson = JSON.parse(propsFile)
    Object.keys(properties).forEach(key => {
      console.log(typeof(propsJson[key]), key)
      if ((typeof(propsJson[key]) == 'string' && (key == 'roku' || key == 'flavor')) ||
        (typeof(propsJson[key]) == 'object' && key == 'rokus')) {
        properties[key] = propsJson[key]
      }
    })
  } catch (e) {
    console.error('Problem reading ukor.properties')
    console.error(e.message)
  }
  try {
    var propsFile = fs.readFileSync(propsLocal)
    var propsJson = JSON.parse(propsFile)
    Object.keys(properties).forEach(key => {
      console.log(typeof(propsJson[key]), key)
      if (key !== 'flavors' && propsJson[key]) {
        if (key == 'rokus' && typeof(propsJson[key]) == 'object') {
          Object.keys(propsJson[key]).forEach(rokuName => {
            properties.rokus[rokuName] = propsJson[key][rokuName]
          })
        } else if (typeof(propsJson[key]) == 'string' && (key == 'roku' || key == 'flavor')) {
          properties[key] = propsJson[key]
        }
      }
    })
  } catch (e) {
    console.error('Problem reading ukor.local')
    console.error(e.message)
  }
}

function getFlavors() {
  var flavors = []
  try {
    fs.readdirSync('src').forEach(file => {
      if (file !== 'main' && fs.lstatSync('src/' + file).isDirectory()) {
        flavors.push(file)
      }
    })
  } catch (e) {
    console.error('"src" directory not found')
  }
  return flavors
}



var properties = {
  roku: '',
  rokus: {},
  flavor: '',
  flavors: getFlavors()
}
readProperties()

module.exports = properties
