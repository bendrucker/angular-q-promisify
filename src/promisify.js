'use strict';

var angular = require('angular');
var assert  = require('assert');

module.exports = function ($q) {

  function promisify (callback, receiver) {
    function promisifed () {
      receiver = receiver || {};
      if (typeof callback === 'string') {
        callback = receiver[callback];
      }
      assert(typeof callback === 'function', 'Callback must be a function');
      var deferred = $q.defer();
      var nodeback = nodebackForDeferred(deferred);
      var args = toArray(arguments);
      args.push(nodeback);
      try {
        callback.apply(receiver, args);
      }
      catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
    promisifed.__isPromisifed = true;
    return promisifed;
  }

  function promisifyAll (object) {
    return angular.forEach(object, function (value, key) {
      if (!value || typeof value !== 'function' || value.__isPromisifed) return;
      object[key + 'Async'] = promisify(key, object);
    }); 
  }

  return angular.extend($q, {
    promisify: promisify,
    promisifyAll: promisifyAll
  });

};
module.exports.$inject = ['$delegate'];


function toArray (args) {
  return [].slice.call(args);
}

function nodebackForDeferred (deferred) {
  return function nodeback (err, value) {
    assert(arguments.length, 'nodebacks must have at least 1 argument');
    if (err) {
      return deferred.reject(err);
    }
    else {
      if (arguments.length <= 2) {
        deferred.resolve(value);
      }
      else {
        deferred.resolve([].slice.call(arguments, 1));
      }
    }
  };
}
