const tester = require('./commands/test')
const log = require('./utils/log')


tester.test({
  roku: 'YY0032772795',
  flavor: 'debug',
  auth: {
    user: 'rokudev',
    pass: 'Password12'
  }
})
