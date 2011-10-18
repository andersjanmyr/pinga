(function() {
  var socket;
  socket = io.connect("http://localhost");
  socket.on('news', function(data) {
    return console.log(data);
  });
}).call(this);
