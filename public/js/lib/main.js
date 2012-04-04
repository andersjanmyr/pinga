(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(function() {
    var Url, UrlView, Urls, UrlsView, socket, urls, urlsView;
    Url = (function() {

      __extends(Url, Backbone.Model);

      function Url() {
        Url.__super__.constructor.apply(this, arguments);
      }

      Url.prototype.defaults = {
        url: 'missing-url'
      };

      return Url;

    })();
    Urls = (function() {

      __extends(Urls, Backbone.Collection);

      function Urls() {
        Urls.__super__.constructor.apply(this, arguments);
      }

      Urls.prototype.url = 'urls';

      return Urls;

    })();
    UrlView = (function() {

      __extends(UrlView, Backbone.View);

      function UrlView() {
        UrlView.__super__.constructor.apply(this, arguments);
      }

      UrlView.prototype.tagName = 'li';

      UrlView.prototype.template = _.template($('#url-tmpl').html());

      UrlView.prototype.render = function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      };

      return UrlView;

    })();
    UrlsView = (function() {

      __extends(UrlsView, Backbone.View);

      function UrlsView() {
        UrlsView.__super__.constructor.apply(this, arguments);
      }

      UrlsView.prototype.tagName = 'ul';

      UrlsView.prototype.initialize = function() {
        return this.collection.bind('reset', this.render, this);
      };

      UrlsView.prototype.render = function() {
        var $el;
        $el = $(this.el);
        $el.empty();
        this.collection.each(function(item) {
          var urlView;
          urlView = new UrlView({
            model: item
          });
          return $el.append(urlView.render().el);
        });
        return this;
      };

      return UrlsView;

    })();
    socket = io.connect();
    Backbone.socket = socket;
    socket.on('status', function(data) {
      return console.log(data);
    });
    urls = new Urls();
    urlsView = new UrlsView({
      collection: urls
    });
    $('#container').append(urlsView.el);
    return urls.fetch();
  });

}).call(this);
