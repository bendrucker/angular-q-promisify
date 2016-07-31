'use strict'

var angular = require('angular')
var assertFn = require('assert-function')
var assert = require('assert-ok')
var toArray = require('to-array')

module.exports = promisify$Q

promisify$Q.$inject = ['$delegate', '$rootScope']
function promisify$Q ($q, $rootScope) {
  function promisify (callback, receiver) {
    receiver = receiver || {}

    if (typeof callback === 'string') {
      callback = receiver[callback]
    }

    assertFn(callback)

    function promisifed () {
      var args = arguments
      return $q(function (resolve, reject) {
        var apply = $rootScope.$apply.bind($rootScope)
        try {
          callback.apply(receiver, toArray(args).concat(Nodeback(apply, resolve, reject)))
        }
        catch (err) {
          setTimeout(function () {
            apply(function () {
              reject(err)
            })
          })
        }
      })
    }
    promisifed.__isPromisifed__ = true
    return promisifed
  }

  function promisifyAll (object) {
    return angular.forEach(object, function (value, key) {
      key = key + 'Async'
      if (!value || typeof value !== 'function' || value.__isPromisifed__) return
      object[key] = promisify(value, object)
    })
  }

  return angular.extend($q, {
    promisify: promisify,
    promisifyAll: promisifyAll
  })

}

function Nodeback (apply, resolve, reject) {
  return function nodeback (err, value) {
    var args = arguments
    apply(function () {
      if (err) {
        return reject(err)
      }

      if (args.length <= 2) {
        return resolve(value)
      }

      resolve(toArray(args, 1))
    })
  }
}
