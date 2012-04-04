SocketResource = require('../../lib/socket-resource')

describe 'SocketResource', ->

  describe '#create', ->
    beforeEach ->
      @socket = {on: ->}
      @resource = new SocketResource @socket, 'animals', {
        create: (data, callback) ->
          # something
      }

    it 'creates a new resource', ->
      @resource.create({name: 'tapir'})

