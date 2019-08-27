const child_process = require('child_process')

const args = process.argv.slice(2)
const ip = args[0] // the roku device ip given as an argument by ukor

// main function call
main()

function main() {
    child_process.execSync(`curl -d '' "http://${ip}:8060/launch/dev?RunTests=true"`)
}
