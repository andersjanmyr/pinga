(function() {
  var PINGS, SendGrid, SocketResource, URLS, app, express, io, item, pingHost, port, request, sendEmail, sendgrid, since, socketio, timestamp, _fn, _i, _len;

  request = require('request');

  express = require('express');

  socketio = require('socket.io');

  SendGrid = require('sendgrid').SendGrid;

  SocketResource = require('./socket-resource');

  sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

  URLS = [
    {
      id: '1',
      url: 'http://equilo.se'
    }, {
      id: '2',
      url: 'http://halsansrum.herokuapp.com'
    }, {
      id: '3',
      url: 'http://hjarups-yoga.herokuapp.com'
    }, {
      id: '4',
      url: 'http://pinga.herokuapp.com'
    }, {
      id: '5',
      url: 'http://functional-javascript.heroku.com'
    }, {
      id: '3',
      url: 'https://agenda-riksdagen.heroku.com/admins/sign_in'
    }
  ];

  PINGS = [];

  app = express.createServer();

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static("" + __dirname + "/../public"));
    app.set('views', "" + __dirname + "/../views");
    return app.set('view options', {
      layout: false
    });
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

  _fn = function(item) {
    var pingUrl;
    pingUrl = function() {
      return pingHost(item.url);
    };
    setInterval(pingUrl, 15 * 60 * 1000);
    return pingUrl();
  };
  for (_i = 0, _len = URLS.length; _i < _len; _i++) {
    item = URLS[_i];
    _fn(item);
  }

  sendEmail('Pinga restarted', timestamp());

  since = timestamp();

  io = socketio.listen(app);

  io.configure(function() {
    io.set("transports", ["xhr-polling"]);
    return io.set("polling duration", 10);
  });

  io.sockets.on('connection', function(socket) {
    socket.emit('status', {
      runningSince: since
    });
    return socket.on('urls:read', function(data, callback) {
      console.log(data);
      return callback(null, URLS);
    });
  });

}).call(this);
