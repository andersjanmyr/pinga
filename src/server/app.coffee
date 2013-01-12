http = require 'http'
request = require 'request'
express = require 'express'
socketio = require 'socket.io'
SendGrid = require('sendgrid').SendGrid
SocketResource = require './socket-resource'

sendgrid = new SendGrid(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
)

URLS = [
  {id: '1', url: 'http://equilo.se'},
  {id: '2', url: 'http://anders-errbit.herokuapp.com'},
  {id: '3', url: 'http://questbox.herokuapp.com'},
  {id: '4', url: 'http://pinga.herokuapp.com'},
  {id: '5', url: 'http://tapirs.herokuapp.com'},
  {id: '6', url: 'http://functional-javascript.heroku.com'}
]

PINGS = []

port = process.env.PORT or process.env.VMC_APP_PORT or 4000

app = express()
server = http.createServer(app)
server.listen(port)

app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static "#{__dirname}/../public"
  app.set('views', "#{__dirname}/../views")
  app.set('view options', { layout: false })

app.get '/pings', (req, resp) ->
  resp.send PINGS


console.log(process.env)
console.log "Starting on port #{port}"
console.log "Serving files from #{__dirname}/../public"

timestamp = ->
  d = new Date
  date = "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}"
  time = "#{d.getHours()}:#{d.getMinutes()}:#{d.getSeconds()}"
  "#{date} #{time}"

pingHost = (url) ->
  request url, (err, response, body) ->
    console.log(err) if err
    PINGS.pop() while PINGS.length > 100
    PINGS.unshift [url, response.statusCode, timestamp()]
    if response.statusCode isnt 200
      sendEmail("#{url} failed", "#{url} failed with status #{response.statusCode}")

sendEmail = (subject, body) ->
  sendgrid.send {
      from: 'pinga@janmyr.com',
      to: 'anders@janmyr.com',
      subject: subject,
      text: body
    },
    (success, errors) ->
      console.log(errors) unless success


for item in URLS
  do (item) ->
    pingUrl = ->
      pingHost item.url
    setInterval pingUrl, 15 * 60 * 1000
    pingUrl()

sendEmail('Pinga restarted', timestamp())

since = timestamp()

io = socketio.listen(server)
io.configure ->
  io.set "transports", ['xhr-polling']
  io.set "polling duration", 10

io.sockets.on 'connection', (socket) ->
  socket.emit 'status', {runningSince: since }
  new SocketResource(socket, 'urls', {
    read: (data, callback) ->
      callback null, URLS
  })

