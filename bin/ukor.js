#!/usr/bin/env node
const program = require('commander')

program
  .command(
    'make [flavors...]',
    'Bundle your channel into a zip to the build directory'
  )
  .command(
    'install [flavor] [roku] [-c, --console]',
    'Bundle then deploy your channel to a named roku'
  )
  .command(
    'package <flavor> <roku>',
    'Package a channel flavor with a roku device'
  )
  .command(
    'rekey <roku>',
    'Rekey your device (an packageReference is required)'
  )
  .command(
    'lint <flavor>',
    'Lint a channel flavor'
  )
  .command(
    'console [roku]',
    'Launch the Telnet console for the named roku'
  )
  .command(
    'debugger [roku]',
    'Launch the Telnet debugger for the named roku'
  )
  .command('find', 'Search for rokus on the network')
  .command('init [flavors...]', 'Initialize a ukor project')
  .command('test', 'Run the tests')
  .command('validate', 'Validate ukor.properties and ukor.local')
  .parse(process.argv)
