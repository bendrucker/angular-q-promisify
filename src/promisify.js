'use strict'

var angular = require('angular')
var assertFn = require('assert-function')
var assert = require('assert-ok')
var toArray = require('to-array')

module.exports = promisify$Q

promisify$Q.$inject = ['$delegate']
function promisify$Q ($q) {
  function promisify (callback, receiver) {
    receiver = receiver || {}

    if (typeof callback === 'string') {
      callback = receiver[callback]
    }

    assertFn(callback)

    function promisifed () {
      var args = arguments
      return $q(function (resolve, reject) {
        try {
          callback.apply(receiver, toArray(args).concat(Nodeback(resolve, reject)))
        }
        catch (err) {
          reject(err)
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

function Nodeback (resolve, reject) {
  return function nodeback (err, value) {
    if (err) {
      return reject(err)
    }

    if (arguments.length <= 2) {
      return resolve(value)
    }

    resolve(toArray(arguments, 1))
  }
}
