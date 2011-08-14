require.paths.unshift('./node_modules')

express = require 'express'
require 'sass'
app = express.createServer()

app.configure -> 
  app.register '.coffee', require('coffeekup')
  app.set 'view engine', 'coffee'
  app.set 'views', __dirname + '/views'
  app.use express.bodyParser()
  app.use express.methodOverride()
  #app.use express.compiler({ src: __dirname + '/public', enable: ['scss'] })
  app.use app.router
  app.use express.static(__dirname + '/public')



app.get '/', (request, response) ->
  response.render 'index'

app.listen(process.env.VMC_APP_PORT || 4000)


