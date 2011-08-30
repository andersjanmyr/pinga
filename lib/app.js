(function() {
  var PINGS, URLS, app, express, pingHost, port, request, timestamp, url, _fn, _i, _len;
  require.paths.unshift('./node_modules');
  request = require('request');
  express = require('express');
  app = express.createServer();
  URLS = ['http://equilo.se', 'http://halsansrum.herokuapp.com', 'http://hjarups-yoga.herokuapp.com', 'http://pinga.herokuapp.com', 'https://agenda-riksdagen.heroku.com/admins/sign_in'];
  PINGS = [];
  app.configure(function() {
    app.use(express.bodyParser());
    return app.use(express.methodOverride());
  });
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
  _fn = function(url) {
    var pingUrl;
    pingUrl = function() {
      return pingHost(url);
    };
    setInterval(pingUrl, 15 * 60 * 1000);
    return pingUrl();
  };
  for (_i = 0, _len = URLS.length; _i < _len; _i++) {
    url = URLS[_i];
    _fn(url);
  }
}).call(this);
