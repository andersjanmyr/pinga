(function() {
  var SocketResource;

  SocketResource = (function() {

    function SocketResource() {}

    SocketResource.prototype.initialize = function(socket, namespace, callbacks) {
      var callback, method, _results;
      this.socket = socket;
      this.namespace = namespace;
      _results = [];
      for (method in methods) {
        callback = methods[method];
        _results.push(this.addMethod(method, callback));
      }
      return _results;
    };

    SocketResource.prototype.addMethod = function(name, method) {
      return this.socket.on("" + this.namespace + ":" + method, callback);
    };

    return SocketResource;

  })();

  module.exports = SocketResource;

}).call(this);
