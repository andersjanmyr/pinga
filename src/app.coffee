require.paths.unshift('./node_modules')

request = require 'request'
express = require 'express'
nodemailer = require 'nodemailer'

app = express.createServer()

URLS = [
  'http://equilo.se',
  'http://halsansrum.herokuapp.com',
  'http://hjarups-yoga.herokuapp.com',
  'http://pinga.herokuapp.com',
  'https://agenda-riksdagen.heroku.com/admins/sign_in']

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
  request url, (error, response, body) ->
    PINGS.pop() while PINGS.length > 100
    PINGS.unshift [url, response.statusCode, timestamp()]
    console.log PINGS
    sendEmail(url, response.statusCode) if response.statusCode isnt 200

nodemailer.SMTP = {
    host: 'smtp.sendgrid.net',  
    port: 25,
    ssl: false, 
    use_authentication: true,
    domain: process.env['SENDGRID_DOMAIN'],
    user: process.env['SENDGRID_USERNAME'],
    pass: process.env['SENDGRID_PASSWORD']
}
sendEmail = (url, status) ->
  nodemailer.send_mail {
      sender: 'pinga@janmyr.com',
      to: 'anders@janmyr.com',
      subject: "#{url} failed",
      body: "#{url} failed with status #{status}"
    },
    (err, result) -> 
      console.log(err) if err


for url in URLS
  do (url) ->
    pingUrl = -> 
      pingHost url
    setInterval pingUrl, 15 * 60 * 1000
    pingUrl()
    console.log(process.env);
    sendEmail('url', 'status')


