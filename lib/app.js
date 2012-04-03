(function() {
  var PINGS, SendGrid, URLS, app, express, jade, pingHost, port, request, sendEmail, sendgrid, timestamp, url, _fn, _i, _len;

  request = require('request');

  express = require('express');

  jade = require('jade');

  SendGrid = require('sendgrid').SendGrid;

  sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

  URLS = ['http://equilo.se', 'http://halsansrum.herokuapp.com', 'http://hjarups-yoga.herokuapp.com', 'http://pinga.herokuapp.com', 'http://functional-javascript.heroku.com', 'https://agenda-riksdagen.heroku.com/admins/sign_in'];

  PINGS = [];

  app = express.createServer();

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static("" + __dirname + "/../public"));
    app.set('views', "" + __dirname + "/../views");
    app.set('view engine', 'jade');
    return app.set('view options', {
      layout: false
    });
  });

  app.get('/', function(req, resp) {
    return resp.render('index');
  });

  app.get('/pings', function(req, resp) {
    return resp.send(PINGS);
  });

  port = process.env.PORT || process.env.VMC_APP_PORT || 4000;

  console.log(process.env);

  console.log("Starting on port " + port);

  console.log("Serving files from " + __dirname + "/../public");

  app.listen(port);

  timestamp = function() {
    var d, date, time;
    d = new Date;
    date = "" + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    time = "" + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
    return "" + date + " " + time;
  };

  pingHost = function(url) {
    return request(url, function(err, response, body) {
      if (err) console.log(err);
      while (PINGS.length > 100) {
        PINGS.pop();
      }
      PINGS.unshift([url, response.statusCode, timestamp()]);
      if (response.statusCode !== 200) {
        return sendEmail("" + url + " failed", "" + url + " failed with status " + response.statusCode);
      }
    });
  };

  sendEmail = function(subject, body) {
    return sendgrid.send({
      from: 'pinga@janmyr.com',
      to: 'anders@janmyr.com',
      subject: subject,
      text: body
    }, function(success, errors) {
      if (!success) return console.log(errors);
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

  sendEmail('Pinga restarted', timestamp());

}).call(this);
