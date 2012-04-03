  socket = io.connect()
  Backbone.socket = socket
  socket.on 'status', (data) ->
    console.log(data)

  class Url extends Backbone.Model
    defaults:
      name: 'name'

  class Urls extends Backbone.Collection
    url: 'urls'

  class UrlView extends Backbone.View
    tagName: 'li'
    template: _.template $('#url-tmpl').html()

    render: ->
      $(@el).html @template(@model)
      @

  class UrlsView extends Backbone.View
    tagName: 'ul'

    render: ->
      $(@el).html @template(@model)
      @

  urls = new Urls()
  urls.fetch()
