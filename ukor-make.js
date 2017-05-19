#!/usr/bin/env node

var program = require('commander')
var properties = require('./properties')


program
  .parse(process.argv)

if (program.args.length == 0) {
  properties.flavors.forEach(str => {
    bundleFlavor(str)
  })
} else {
  properties.args.forEach(str => {
    bundleFlavor(str)
  })
}

function bundleFlavor(flavor) {
  if (properties.flavors.includes(flavor)) {

  } else {
    console.error('cannot find flavor: ' + flavor)
  }
}
