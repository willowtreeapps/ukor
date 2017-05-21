const find = require('./commands/find')
const program = require('commander')

program
  .arguments('[id]')
  .option('-t, --timeout <seconds>', 'Time to scan in seconds')
  .parse(process.argv)

let t = 5
if (program['timeout']) {
  t = program.timeout
}

if (program.args.length == 0) {
  find.scan(5)
} else {
  find.usn(program.args[0])
}
