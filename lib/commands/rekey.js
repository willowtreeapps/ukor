const fs = require('fs')
const request = require('request')
const log = require('../utils/log')
const properties = require('../utils/properties')

function rekey(options, ip) {
 const form = {
   mysubmit: 'Rekey',
   passwd: properties.packageKey,
   archive: fs.createReadStream(properties.packageReference)
 }

 request.post(
   {
     url: 'http://' + ip + '/plugin_inspect',
     formData: form,
     auth: options.auth
   },
   (error, response, body) => {
     if (error || !body) {
       log.error('Rekey device falied:')
       log.error(error)
     } else {
       urls = parseBody(body)

       if (urls) {
        console.log(urls)
       } else {
         log.error('Falied to rekey');
       }
     }
   }
 )
}


module.exports = {
  rekey
}
