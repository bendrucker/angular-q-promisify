'use strict'

var angular = require('angular')
var Promisify = require('./promisify')

module.exports = angular
  .module('promisify-decorate', [])
  .config(provideDecorator)
  .name

provideDecorator.$inject = ['$provide']
function provideDecorator ($provide) {
  $provide.decorator('$q', decorator)
}

decorator.$inject = ['$delegate', '$rootScope']
function decorator ($q, $rootScope) {
  var promisify = Promisify($q, $rootScope)

  return angular.extend($q, {
    promisify: promisify,
    promisifyAll: promisify.promisifyAll
  })
}
