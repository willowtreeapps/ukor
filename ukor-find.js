const find = require('./commands/find')
const program = require('./utils/log-commander')

program
  .arguments('[id]')
  .option('-t, --timeout <seconds>', 'Time to scan in seconds')
  .parse(process.argv)

let t = 5
if (program['timeout']) {
  t = program.timeout
}

if (program.args.length == 0) {
  find.scan(t)
} else {
  find.usn(program.args[0], t)
}
