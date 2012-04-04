$ ->

  class Url extends Backbone.Model
    defaults:
      url: 'missing-url'

  class Urls extends Backbone.Collection
    url: 'urls'

  class UrlView extends Backbone.View
    tagName: 'li',
    template: _.template($('#url-tmpl').html()),

    render: ->
      $(@el).html @template(@model.toJSON())
      @

  class UrlsView extends Backbone.View
    tagName: 'ul',
    initialize: ->
      @collection.bind 'reset', @render, @

    render: ->
      $el = $(@el)
      $el.empty()
      @collection.each (item) ->
        urlView = new UrlView(model: item)
        $el.append urlView.render().el
      @

  socket = io.connect()
  Backbone.socket = socket
  socket.on 'status', (data) ->
    console.log(data)

  urls = new Urls()

  urlsView = new UrlsView(collection: urls)
  $('#container').append urlsView.el
  urls.fetch()

