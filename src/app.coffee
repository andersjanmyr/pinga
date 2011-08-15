require.paths.unshift('./node_modules')

http = require 'http'
express = require 'express'

app = express.createServer()

URLS = ['equilo.se', 'halsansrum.herokuapp.com', 'hjarups-yoga.herokuapp.com']
PINGS = []


app.configure -> 
  app.use express.bodyParser()
  app.use express.methodOverride()
 app.use app.router
 app.use express.static(__dirname + '/public')



app.get '/', (request, response) ->
  response.send PINGS

port = process.env.PORT or process.env.VMC_APP_PORT or 4000 
console.log "Starting on port #{port}"
app.listen(port)

timestamp = ->
  d = new Date
  date = "#{d.getFullYear()}-#{d.getMonth()+1}-#{d.getDate()}"
  time = "#{d.getHours()}:#{d.getMinutes()}:#{d.getSeconds()}"
  "#{date} #{time}"

pingHost = (url) ->
  console.log "Making request to #{url}"
  client = http.createClient 80, url
  req = client.request('GET', '/', { Host: url })
  req.end()

  req.on 'response', (res) ->
    PINGS.pop() while PINGS.length > 100
    PINGS.unshift [url, res.statusCode, timestamp()]
    console.log PINGS

for url in URLS
  do (url) ->
    pingUrl = -> 
      pingHost url
    setInterval pingUrl, 15 * 60 * 1000
    pingUrl()


