(function() {
  var PINGS, URLS, app, express, nodemailer, pingHost, port, request, sendEmail, timestamp, url, _fn, _i, _len;
  require.paths.unshift('./node_modules');
  request = require('request');
  express = require('express');
  nodemailer = require('nodemailer');
  app = express.createServer();
  URLS = ['http://equilo.se', 'http://halsansrum.herokuapp.com', 'http://hjarups-yoga.herokuapp.com', 'http://pinga.herokuapp.com', 'https://agenda-riksdagen.heroku.com/admins/sign_in'];
  PINGS = [];
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.get('/', function(request, response) {
    return response.send(PINGS);
  });
  port = process.env.PORT || process.env.VMC_APP_PORT || 4000;
  console.log("Starting on port " + port);
  app.listen(port);
  timestamp = function() {
    var d, date, time;
    d = new Date;
    date = "" + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    time = "" + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
    return "" + date + " " + time;
  };
  pingHost = function(url) {
    console.log("Making request to " + url);
    return request(url, function(error, response, body) {
      while (PINGS.length > 100) {
        PINGS.pop();
      }
      PINGS.unshift([url, response.statusCode, timestamp()]);
      console.log(PINGS);
      if (response.statusCode !== 200) {
        return sendEmail("" + url + " failed", "" + url + " failed with status " + response.statusCode);
      }
    });
  };
  nodemailer.SMTP = {
    host: 'smtp.sendgrid.net',
    port: 25,
    ssl: false,
    use_authentication: true,
    domain: process.env['SENDGRID_DOMAIN'],
    user: process.env['SENDGRID_USERNAME'],
    pass: process.env['SENDGRID_PASSWORD']
  };
  sendEmail = function(subject, body) {
    return nodemailer.send_mail({
      sender: 'pinga@janmyr.com',
      to: 'anders@janmyr.com',
      subject: subject,
      body: body
    }, function(err, result) {
      if (err) {
        return console.log(err);
      }
    });
  };
  _fn = function(url) {
    var pingUrl;
    pingUrl = function() {
      return pingHost(url);
    };
    setInterval(pingUrl, 15 * 60 * 1000);
    pingUrl();
    return console.log(process.env);
  };
  for (_i = 0, _len = URLS.length; _i < _len; _i++) {
    url = URLS[_i];
    _fn(url);
  }
  sendEmail('Ping restarted', '');
}).call(this);
