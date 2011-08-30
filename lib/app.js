(function() {
  var PINGS, URLS, app, email, express, pingHost, port, request, sendEmail, timestamp, url, _fn, _i, _len;
  require.paths.unshift('./node_modules');
  request = require('request');
  express = require('express');
  email = require('mailer');
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
      return console.log(PINGS);
    });
  };
  sendEmail = function(url, status) {
    return email.send({
      host: 'smtp.sendgrid.net',
      port: "25",
      ssl: false,
      domain: process.env['SENDGRID_DOMAIN'],
      to: "anders@janmyr.com",
      from: "pinga@janmyr.com",
      subject: "" + url + " failed",
      body: "" + url + " failed with status " + status,
      authentication: "plain",
      username: process.env['SENDGRID_USERNAME'],
      password: process.env['SENDGRID_PASSWORD']
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
    return sendEmail('url', 'status');
  };
  for (_i = 0, _len = URLS.length; _i < _len; _i++) {
    url = URLS[_i];
    _fn(url);
  }
}).call(this);
