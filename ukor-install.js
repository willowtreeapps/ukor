const install = require('./commands/install')
var program = require('commander')

program.parse(process.argv)
console.log(program)
install.install(program.args[0], program.args[1])