  socket = io.connect "http://localhost"
  socket.on 'status', (data) ->
    console.log(data)

