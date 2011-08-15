(function() {
  var PINGS, URLS, app, express, http, pingHost;
  require.paths.unshift('./node_modules');
  http = require('http');
  express = require('express');
  app = express.createServer();
  URLS = ['equilo.se', 'halsansrum.heroku.com'];
  PINGS = [];
  console.log('Starting on port 4000');
  app.configure(function() {
    app.use(express.bodyParser());
    return app.use(express.methodOverride());
  });
  app.get('/', function(request, response) {
    return response.send(PINGS);
  });
  app.listen(process.env.VMC_APP_PORT || 4000);
  pingHost = function(url) {
    var client, req;
    console.log("Making request to " + url);
    client = http.createClient(80, url);
    req = client.request('GET', '/', {
      Host: url
    });
    req.end();
    return req.on('response', function(res) {
      console.log(url, res.statusCode);
      if (PINGS.length > 100) {
        PINGS = [];
      }
      PINGS.push("" + url + ": " + res.statusCode);
      return console.log(PINGS);
    });
  };
  URLS.forEach(function(url) {
    var pingUrl;
    pingUrl = function() {
      return pingHost(url);
    };
    return setInterval(pingUrl, 15 * 60 * 1000);
  });
}).call(this);
