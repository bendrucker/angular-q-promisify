'use strict'

var angular = require('angular')
var expect  = require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).expect
var sinon   = require('sinon')

describe('angular-q-promisify', function () {

  var $q, $timeout
  beforeEach(angular.mock.module(require('../')))
  beforeEach(angular.mock.inject(function (_$q_, _$timeout_) {
    $q = _$q_
    $timeout = _$timeout_
  }))

  var nodeback
  beforeEach(function () {
    nodeback = sinon.stub()
  })

  describe('#promisify', function () {

    it('promisifes a nodeback', function () {
      nodeback.yieldsAsync(null)
      return $q.promisify(nodeback)()
    })

    it('passes through the arguments', function () {
      nodeback.yieldsAsync(null)
      return $q.promisify(nodeback)('foo', 'bar').then(function () {
        expect(nodeback).to.have.been.calledWith('foo', 'bar')
      })
    })

    it('fulfills with a value', function () {
      nodeback.yieldsAsync(null, 'foo')
      return expect($q.promisify(nodeback)()).to.eventually.equal('foo')
    })

    it('returns multiple values as an array', function () {
      nodeback.yieldsAsync(null, 'foo', 'bar')
      return expect($q.promisify(nodeback)()).to.eventually.deep.equal(['foo', 'bar'])
    })

    it('rejects with errors', function () {
      var err = new Error()
      nodeback.yieldsAsync(err)
      return expect($q.promisify(nodeback)()).to.be.rejectedWith(err)
    })

    it('rejects with errors thrown by the callback', function () {
      var err = new Error()
      nodeback.throws(err)
      return expect($q.promisify(nodeback)()).to.be.rejectedWith(err)
    })

    it('can set a receiver (this)', function () {
      nodeback.yieldsAsync(null)
      var receiver = {}
      return $q.promisify(nodeback, receiver)().then()
        .then(function () {
          expect(nodeback).to.have.been.calledOn(receiver)
        })
    })

    it('throws if called on a non-function', function () {
      expect(angular.bind(null, $q.promisify, 'foo')).to.throw('function')
    })

  })

  describe('#promisifyAll', function () {

    it('promsifies an object', function () {
      var object = {
        method: nodeback.yieldsAsync(null)
      }
      $q.promisifyAll(object)
      return expect(object.methodAsync()).to.eventually.be.fulfilled
        .then(function () {
          expect(object.method).to.have.been.calledOn(object)
        })
    })

    it('does not rewrap promisifed methods', function () {
      var object = {
        method: nodeback.yieldsAsync(null)
      }
      $q.promisifyAll(object)
      var method = object.method
      $q.promisifyAll(object)
      expect(object.method).to.equal(method)
    })

  })

})
