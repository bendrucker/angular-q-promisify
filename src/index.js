'use strict';

module.exports = require('angular')
  .module('promisify', [])
  .config(provideDecorator)
  .name;

function provideDecorator ($provide) {
  $provide.decorator('$q', require('./promisify'));
}
provideDecorator.$inject = ['$provide'];
