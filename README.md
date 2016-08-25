# angular-q-promisify [![Build Status](https://travis-ci.org/bendrucker/angular-q-promisify.svg?branch=master)](https://travis-ci.org/bendrucker/angular-q-promisify)

Angular service for returning `$q` promises from callback APIs. Inspired by [Bluebird's promsification API](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification), angular-q-promsify uses `$q` to convert functions and objects that take callbacks into ones that return `$q` promises.

## Installing

```bash
$ npm install angular-q-promisify
```

## Setup

```js
// Service
angular.module('myApp', [
  require('angular-q-promisify')
])

// Decorator
angular.module('myApp', [
  require('angular-q-promisify/decorate')
])
```

Using the decorate module adds `promisify` and `promisifyAll` to `$q` instead of exposing a new service.


## API

**Service name:** `promisify`

##### `promisify(nodeback [, receiver])` -> `Function`

Accepts a `nodeback` (a callback with the signature `(err, args...)`) and returns a function that returns a `$q` promise instead. If the `nodeback` is called with more than 2 arguments, the values will be returned as an array. If the callback is called with an error (`err`) or throws an exception, the promise returned by the promisified function will become rejected.

If a `receiver` is passed, the `nodeback` will be called on it, so `this` will be the `receiver`.

Note that the promisification logic is dramatically less sophisticated than Bluebird's. The function's `length` property will not be preserved among other potential inconsistencies. Most simple cases will work.

```js
function getData (callback) {
  // ...
}
var getDataPromise = promisify(getData)
getDataPromise().then(handleData).catch(handleErr)
```

<hr>

##### `promisify.promisifyAll(object)` -> `object`

Promsifies all methods on an `object`, suffixing them with `'Async'`.

```js
var user = {
  getData: function (callback) {
    // ...
  }
}
promisify.promisifyAll(user)
user.getDataAsync().then(handleUserData).catch(handleUserErr)
```
