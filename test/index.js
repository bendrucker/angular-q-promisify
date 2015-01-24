'use strict';

var angular = require('angular');
var expect  = require('chai').use(require('chai-as-promised')).expect;
var sinon   = require('sinon');

describe('angular-q-promisify', function () {

  var $q, $timeout;
  beforeEach(angular.mock.module(require('../')));
  beforeEach(angular.mock.inject(function (_$q_, _$timeout_) {
    $q = _$q_;
    $timeout = _$timeout_;
  }));

  describe('#promisify', function () {

    it('promisifes a nodeback', function () {
      var nodeback = sinon.stub().yields(null);
      expect($q.promisify(nodeback)()).to.be.fulfilled;
      $timeout.flush();
    });

  });

});
