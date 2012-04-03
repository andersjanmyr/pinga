(function() {
  var socket;

  socket = io.connect("http://localhost");

  socket.on('status', function(data) {
    return console.log(data);
  });

}).call(this);
