const http = require('http')

module.exports = {
    install: (flavor, roku) => {
        upload(flavor, roku)
    }
}

function upload(flavor, roku) {
    console.log(flavor, roku)
    var zip = 'build/' + flavor + '.zip'
    console.log('google.com')
    http.request({
        method: 'GET',
        host: 'gooogle.com'
    }, (res) => {
        res.on('data', data => {
            console.log(data.toString())
        })
    })
}