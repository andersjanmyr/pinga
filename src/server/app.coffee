http = require 'http'
request = require 'request'
express = require 'express'
bodyParser = require 'body-parser'
methodOverride = require 'method-override'
socketio = require 'socket.io'
SendGrid = require('sendgrid')
SocketResource = require './socket-resource'

sendgrid = SendGrid(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
)

URLS = [
  {id: '1', url: 'http://www.equilo.se'},
  {id: '4', url: 'http://pinga.janmyr.com'},
  {id: '5', url: 'http://tapirs.janmyr.com'},
  {id: '9', url: 'http://vocabulary.janmyr.com'}
]

PINGS = []

port = process.env.PORT or process.env.VMC_APP_PORT or 4000

app = express()
server = http.createServer(app)
server.listen(port)

app.use bodyParser.json()
app.use methodOverride()
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
    return console.log(err) if err
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

io.sockets.on 'connection', (socket) ->
  socket.emit 'status', {runningSince: since }
  new SocketResource(socket, 'urls', {
    read: (data, callback) ->
      callback null, URLS
  })

