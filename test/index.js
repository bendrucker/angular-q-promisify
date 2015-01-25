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

    var nodeback;
    beforeEach(function () {
      nodeback = sinon.stub();
    })

    it('promisifes a nodeback', function () {
      nodeback.yields(null);
      expect($q.promisify(nodeback)()).to.be.fulfilled;
      $timeout.flush();
    });

    it('fulfills with a value', function () {
      nodeback.yields(null, 'foo');
      expect($q.promisify(nodeback)()).to.eventually.equal('foo');
      $timeout.flush();
    });

    it('returns multiple values as an array', function () {
      nodeback.yields(null, 'foo', 'bar');
      expect($q.promisify(nodeback)()).to.eventually.deep.equal(['foo', 'bar']);
      $timeout.flush();
    });

    it('rejects with errors', function () {
      var err = new Error();
      nodeback.yields(err);
      expect($q.promisify(nodeback)()).to.be.rejectedWith(err);
      $timeout.flush();
    });

    it('rejects with errors thrown by the callback', function () {
      var err = new Error();
      nodeback.throws(err);
      expect($q.promisify(nodeback)()).to.be.rejectedWith(err);
      $timeout.flush();
    });

    it('throws if called on a non-function', function () {
      expect(angular.bind(null, $q.promisify, 'foo')).to.throw('must be a function');
    });

  });

});
