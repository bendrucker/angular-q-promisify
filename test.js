'use strict'

/* global describe, beforeEach, it */

var angular = require('angular')
var expect = require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).expect
var sinon = require('sinon')

require('angular-mocks/ngMock')

describe('angular-q-promisify', function () {
  var promisify
  beforeEach(angular.mock.module(require('./')))
  beforeEach(angular.mock.inject(function (_promisify_) {
    promisify = _promisify_
  }))

  var nodeback
  beforeEach(function () {
    nodeback = sinon.stub()
  })

  describe('#promisify', function () {
    it('promisifes a nodeback', function () {
      nodeback.yieldsAsync(null)
      return promisify(nodeback)()
    })

    it('passes through the arguments', function () {
      nodeback.yieldsAsync(null)
      return promisify(nodeback)('foo', 'bar').then(function () {
        expect(nodeback).to.have.been.calledWith('foo', 'bar')
      })
    })

    it('fulfills with a value', function () {
      nodeback.yieldsAsync(null, 'foo')
      return expect(promisify(nodeback)()).to.eventually.equal('foo')
    })

    it('returns multiple values as an array', function () {
      nodeback.yieldsAsync(null, 'foo', 'bar')
      return expect(promisify(nodeback)()).to.eventually.deep.equal(['foo', 'bar'])
    })

    it('rejects with errors', function () {
      var err = new Error()
      nodeback.yieldsAsync(err)
      return expect(promisify(nodeback)()).to.be.rejectedWith(err)
    })

    it('rejects with errors thrown by the callback', function () {
      var err = new Error()
      nodeback.throws(err)
      return expect(promisify(nodeback)()).to.be.rejectedWith(err)
    })

    it('can set a receiver (this)', function () {
      nodeback.yieldsAsync(null)
      var receiver = {}
      return promisify(nodeback, receiver)().then()
        .then(function () {
          expect(nodeback).to.have.been.calledOn(receiver)
        })
    })

    it('throws if called on a non-function', function () {
      expect(angular.bind(null, promisify, 'foo')).to.throw('function')
    })
  })

  describe('#promisifyAll', function () {
    it('promsifies an object', function () {
      var object = {
        method: nodeback.yieldsAsync(null)
      }
      promisify.promisifyAll(object)
      return expect(object.methodAsync()).to.eventually.be.fulfilled
        .then(function () {
          expect(object.method).to.have.been.calledOn(object)
        })
    })

    it('does not rewrap promisifed methods', function () {
      var object = {
        method: nodeback.yieldsAsync(null)
      }
      promisify.promisifyAll(object)
      var method = object.method
      promisify.promisifyAll(object)
      expect(object.method).to.equal(method)
    })
  })
})
