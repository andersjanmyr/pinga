class SocketResource
  initialize: (@socket, @namespace, callbacks) ->
    for method, callback of methods
      @addMethod(method, callback)

  addMethod: (name, method) ->
    @socket.on "#{@namespace}:#{method}", callback

module.exports = SocketResource

