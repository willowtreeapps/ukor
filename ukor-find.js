const find = require('./commands/find')
const program = require('commander')

program.parse(process.argv)

if (program.args.lenght == 0) {
    find.all()
} else {
    find.usn('2N00EF283689')
}

