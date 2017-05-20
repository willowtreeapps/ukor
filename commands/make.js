const archiver = require('archiver')
const fs = require('fs')

var properties = null;
var program = null;
var config = {
    zip: {},
    curl: {}
}

module.exports = {
    make: function (flavor) {
        bundleFlavor(flavor)
    },
    run: function (properties, program) {
        properties.flavors.forEach(flavor => {
            bundleFlavor(flavor)
        })
    }
}

function bundleFlavor(flavor) {
    var out = fs.createWriteStream('build/' + flavor + '.zip')
    var archive = archiver('zip')
    out.on('close', () => {
        console.log('archiver finished')
    })
    archive.pipe(out)
    archive.bulk([{
        expand: true,
        src: './**/*',
        cwd: './src/main'
    }, {
        expand: true,
        src: './**/*',
        cwd: './src/' + flavor
    }])
    archive.finalize()
}




