class SocketResource
  resourceMethods: ['create', 'read', 'update', 'delete'],

  constructor: (@socket, @namespace, @methods) ->
    for name in @resourceMethods
      @activateMethod name

  activateMethod: (name) ->
    @socket.on "#{@namespace}:#{name}", this[name]

  create: (data, callback) =>
    @methods.create(data, (err, model) ->
      callback(err, model)
      @socket.emit "#{@namespace}:create", model
    )

  read: (data, callback) =>
    @methods.read(data, callback)

  update: (data, callback) =>
    @methods.update(data, (err, model) ->
      callback(err, model)
      @socket.emit "#{@namespace}/#{model.id}:update", model
    )

  delete: (data, callback) =>
    @methods.delete(data, (err, model) ->
      callback(err, model)
      @socket.emit "#{@namespace}/#{model.id}:delete", model
    )

module.exports = SocketResource

