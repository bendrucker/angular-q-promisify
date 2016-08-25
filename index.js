'use strict'

var promisify = require('./promisify')

module.exports = require('angular')
  .module('promisify', [])
  .service('promisify', promisify)
  .name
