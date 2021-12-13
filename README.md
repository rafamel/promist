# promist

[![Version](https://img.shields.io/npm/v/promist.svg)](https://www.npmjs.com/package/promist)
[![Build Status](https://img.shields.io/travis/rafamel/promist/master.svg)](https://travis-ci.org/rafamel/promist)
[![Coverage](https://img.shields.io/coveralls/rafamel/promist/master.svg)](https://coveralls.io/github/rafamel/promist)
[![Dependencies](https://img.shields.io/david/rafamel/promist.svg)](https://david-dm.org/rafamel/promist)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/promist.svg)](https://snyk.io/test/npm/promist)
[![License](https://img.shields.io/github/license/rafamel/promist.svg)](https://github.com/rafamel/promist/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/promist.svg)](https://www.npmjs.com/package/promist)

> A dependable promises and async utility belt.

## Install

[`npm install promist`](https://www.npmjs.com/package/promist)

## Documentation

* *Classes:* a set of promise classes.
  * [`ExtensiblePromise`:](https://rafamel.github.io/promist/classes/ExtensiblePromise.html) a safe to extend promise class.
  * [`CancellablePromise`:](https://rafamel.github.io/promist/classes/CancellablePromise.html) a cancellable promise.
    * [`cancel`](https://rafamel.github.io/promist/classes/CancellablePromise.html#cancel)
  * [`DeferredPromise`:](https://rafamel.github.io/promist/classes/DeferredPromise.html) an externally actionable promise.
    * [`resolve`](https://rafamel.github.io/promist/classes/DeferredPromise.html#resolve)
    * [`reject`](https://rafamel.github.io/promist/classes/DeferredPromise.html#reject)
  * [`LazyPromise`:](https://rafamel.github.io/promist/classes/LazyPromise.html) a promise that will not execute until awaited.
    * [static `from`](https://rafamel.github.io/promist/classes/LazyPromise.html#from)
    * [`consume`](https://rafamel.github.io/promist/classes/LazyPromise.html#consume)
    * [`operate`](https://rafamel.github.io/promist/classes/LazyPromise.html#operate)
  * [`SyncPromise`:](https://rafamel.github.io/promist/classes/SyncPromise.html) a promise with values synchronously available and operable.
    * [static `from`](https://rafamel.github.io/promist/classes/SyncPromise.html#from)
* *Creation*: a set of promise returning conveniency functions.
  * [`wait`:](https://rafamel.github.io/promist/modules.html#wait) waits for a set time.
  * [`until`:](https://rafamel.github.io/promist/modules.html#until) resolves once a test function returns true.
  * [`timeout`:](https://rafamel.github.io/promist/modules.html#timeout) cancels a promise after a set time.
* *Iterables*: a set of functions to deal with iterables of promises.
  * [`Series`:](https://rafamel.github.io/promist/classes/Series.html) executes operations' callbacks in series.
    * [`map`](https://rafamel.github.io/promist/classes/Series.html#map)
    * [`filter`](https://rafamel.github.io/promist/classes/Series.html#filter)
    * [`reduce`](https://rafamel.github.io/promist/classes/Series.html#reduce)
    * [`each`](https://rafamel.github.io/promist/classes/Series.html#each)
  * [`Parallel`:](https://rafamel.github.io/promist/classes/Parallel.html) executes operations' callbacks in parallel.
    * [`map`](https://rafamel.github.io/promist/classes/Parallel.html#map)
    * [`filter`](https://rafamel.github.io/promist/classes/Parallel.html#filter)
    * [`reduce`](https://rafamel.github.io/promist/classes/Parallel.html#reduce)
    * [`each`](https://rafamel.github.io/promist/classes/Parallel.html#each)
* *Utils:* a set of utility functions.
  * [`control`:](#controltest-function-generator-function-function) for async flow control via generators.
  * [`isPromise`:](#ispromisevalue-any-boolean) a type guard for promises.
  * [`isPromiseLike`:](#ispromiselikevalue-any-boolean) a type guard for thenable objects.

## Utils

### `control(test: Function, generator: Function): Function`

Used to control async flow. It returns a promise returning function taking the same arguments as `generator`.

* `test`: a test *function* (can be `async`) that will be run before calling each `next()` on `generator`, with signature  `() => Promise<boolean | Error> | boolean | Error`. It can return:
  * `false`: `generator` will not continue execution (it will never resolve).
  * `true`: `generator` will continue execution until the next `yield`.
  * `Error`: `generator` call will return a rejected promise. The same behavior can be expected if the error is thrown instead of returned.
* `generator`: must be a *generator function.* Within it, you'd use `yield` as you would `await` for an `async` function.

```javascript
import { control } from 'promist';

function* gen(n) {
  // You can use yield as you'd use await
  let res = yield Promise.resolve(n * 2);
  // test() will be called here,
  // if it returns falsy or throws an error this next line won't execute
  res = yield Promise.resolve(res * 5);

  return res;
}

const willContinue = control(() => true, gen);
const willNotContinue = control(() => false, gen);
const willReject = control(() => Error('An error ocurred'), gen);

willContinue(1).then(console.log); // 10
willNotContinue(2).then(console.log); // Will not resolve
willReject(3).then(console.log).catch(console.error); // Error: An error occurred
```

### `isPromise(value: any): boolean`

Returns `true` if `value` is a *thenable* and *catchable,* `false` otherwise.

* `value`: *object* to test.

```javascript
import { isPromise } from 'promist';

if (isPromise(promise)) {
  promise.then(() => { /* ... */ }).catch(() => { /* ... */ });
}
```

### `isPromiseLike(value: any): boolean`

Returns `true` if `value` is a *thenable,* `false` otherwise.

* `value`: *object* to test.

```javascript
import { isPromiseLike } from 'promist';

if (isPromiseLike(promise)) {
  promise.then(() => { /* ... */ });
}
```
