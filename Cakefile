{spawn, exec} = require 'child_process'
fs = require 'fs'


task 'build', 'build the src library', ->
  server = spawn 'coffee', ['-c', '-o', 'lib', 'src/server']
  server.stdout.on 'data', (data) -> console.log data.toString().trim()

  client = spawn 'coffee', ['-c', '-o', 'public/js/lib', 'src/client']
  client.stdout.on 'data', (data) -> console.log data.toString().trim()

task 'doc', 'rebuild the Docco documentation', ->
  exec([
    'docco app/*.coffee'
  ].join(' && '), (err) ->
    throw err if err
  )

