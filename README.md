# angular-q-promisify

Angular service for returning `$q` promises from callback APIs. Inspired by [Bluebird's promsification API](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification), angular-q-promsify decorates `$q` with methods for converting functions and objects that take callbacks into ones that return `$q` promises.

## Installing

```bash
$ npm install angular-q-promisify
```

## Setup

```js
angular.module('myApp', [
  require('angular-q-promisify')
]);
```

## API

angular-q-promisify decorates the `$q` service. To use the API, inject `$q`.

##### `$q.promisify(nodeback [, receiver])` -> `Function`

Accepts a `nodeback` (a callback with the signature `(err [, arg1...])`) and returns a function that returns a `$q` promise instead. If the `nodeback` is called with more than 2 arguments, the values will be returned as an array. If the callback is called with an error (`err`) or throws an exception, the promise returned by the promisified function will become rejected.

If a `receiver` is passed, the `nodeback` will be called on it, so `this` will be the `receiver`.

Note that the promisification logic is dramatically less sophisticated than Bluebird's. The function's `length` property will not be preserved among other potential inconsistencies. Most simple cases will work.

```js
function getData (err, data) {
  // ... 
}
var getDataPromise = $q.promisify(getData);
getDataPromise.then(handleData).catch(handleErr);
```

##### `$q.promisifyAll(object)` -> `object`

Promsifies all methods on an `object`, suffixing them with `'Async'`.

```js
var user = {
  getData: function (err, data) {
    // ...
  }
};
$q.promisifyAll(user);
user.getDataAsync().then(handleUserData).catch(handleUserErr);
```
