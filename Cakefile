{spawn, exec} = require 'child_process'
fs = require 'fs'


task 'build', 'continually build the src library with --watch', ->
  coffee = spawn 'coffee', ['-cw', '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> console.log data.toString().trim()

task 'doc', 'rebuild the Docco documentation', ->
  exec([
    'docco app/*.coffee'
  ].join(' && '), (err) ->
    throw err if err
  )

