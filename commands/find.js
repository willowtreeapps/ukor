var ssdp = require('node-ssdp').Client
var roku = require('roku')

module.exports = {
    all: () => {

        console.log('searching for any roku for 5 seconds...')
        var client = new ssdp()
        var roku = null;
        client.on('response', function (headers, stats, rinfo) {
            console.log('found roku id: ' + headers.USN.replace('uuid:roku:ecp:', ''))
        })
        setTimeout(() => { console.log('done') }, 5000)
        client.search('roku:ecp')
    },
    usn: (id) => {
        console.log('searching for ' + id + ' roku for 5 seconds...')
        var client = new ssdp()
        var roku = null
        client.on('response', function (headers, stats, rinfo) {
            if (headers.USN == 'uuid:roku:ecp:' + id) {
                console.log('success! : ' + headers.USN.replace('uuid:roku:ecp:', ''))
                roku = rinfo.address
            }
        })
        setTimeout(() => {
            if (roku) {
                return roku
            } else {
                console.log('failed')
            }
        }, 5000)
        client.search('roku:ecp')
    }
}