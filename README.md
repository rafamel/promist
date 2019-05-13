# Promist

[![Version](https://img.shields.io/npm/v/promist.svg)](https://www.npmjs.com/package/promist)
[![Build Status](https://img.shields.io/travis/rafamel/promist/master.svg)](https://travis-ci.org/rafamel/promist)
[![Coverage](https://img.shields.io/coveralls/rafamel/promist/master.svg)](https://coveralls.io/github/rafamel/promist)
[![Dependencies](https://img.shields.io/david/rafamel/promist.svg)](https://david-dm.org/rafamel/promist)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/promist.svg)](https://snyk.io/test/npm/promist)
[![License](https://img.shields.io/github/license/rafamel/promist.svg)](https://github.com/rafamel/promist/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/promist.svg)](https://www.npmjs.com/package/promist)

> A dependable promises and async utility belt. Not a `Promise` implementation.

If you find it useful, consider [starring the project](https://github.com/rafamel/promist) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

## Install

[`npm install promist`](https://www.npmjs.com/package/promist)

## Basics

`promist` intends to cover and abstract the most common day to day dealings with async behavior and promises. It doesn't intend to be the most complete library, or an incredibly slim one, but rather be a dependable set of functions that serve as go-to for most use cases.

* [*Promises*:](#promises) There are *create* and *compose* functions:
  * [*Create* functions](#create-functions) return a newly formed promise.
    * [`wait()`](#waitms-number-promise)
    * [`waitUntil()`](#waituntiltestcb-function-ms-number-promise)
    * [`deferred()`](#deferred-promise)
    * [`lazy()`](#lazyexecutor-function-promise)
    * [`immediate()`](#immediate-promise)
  * [*Compose* functions](#compose-functions) mutate an input promise in order to provide some added functionality. They can be chained via [`compose()`.](#composefns-function)
    * [`deferrable()`](#deferrablepromise-promise-promise)
    * [`cancellable()`](#cancellablepromise-promise-promise)
    * [`status()`](#statuspromise-promise-promise)
    * [`timed()`](#timedpromise-promise-promise)
    * [`delay()`](#delayms-number-delayrejection-boolean-function)
    * [`timeout()`](#timeoutms-number-reason-any-function)
  * There are also some [utility functions.](#utils)
    * [`compose()`](#composefns-function-function)
    * [`control()`](#controltest-function-generator-function-function)
    * [`isPromise()`](#ispromiseobject-any-boolean)
* [*Collections*:](#collections) Handled either in *parallel* or *series.*
  * [`map()`](#maparr-promise-callback-function-promise)
  * [`filter()`](#filterarr-promise-callback-function-promise)
  * [`reduce()`](#reducearr-promise-callback-function-initialvalue-any-promise)
  * [`each()`](#eacharr-promise-callback-function-promise)

## Promises

### Create functions

*Create* functions return a newly formed promise.

#### `wait(ms: Number): Promise`

Returns a promise that will resolve after `ms` milliseconds;

* `ms`: Number of milliseconds to wait for until resolution.

```javascript
import { wait } from 'promist';

wait(100).then(() => console.log('Resolved after 100ms'));
```

#### `waitUntil(testCb: Function, ms?: Number): Promise`

Returns a promise that resolves when `testCb` returns truthy, with its value.

* `testCb`: Test function.
* `ms`: The frequency `testCb` should be called at until it returns truthy. Default: `20`.

```javascript
import { waitUntil } from 'promist';

let example = 1;

waitUntil(() => example === 10).then(() => console.log('Resolved after example = 10'));
example = 10;
```

#### `deferred(): Promise`

Returns a newly formed deferrable promise, with methods:

* `promise.resolve(value: any): void`: Resolves the promise.
* `promise.reject(reason: any): void`: Rejects the promise.

```javascript
import { deferred } from 'promist';

const promise = deferred();
promise.then(val => console.log('Resolves with "Hello":', val));
promise.resolve('Hello');
```

#### `lazy(executor: Function): Promise`

Returns a lazy promise: it's executor won't run until `promise.then()`, `promise.catch()`, or `promise.finally()` are called for the first time.

* `executor`: A function with the same signature as in [`new Promise(executor)`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```javascript
import { lazy } from 'promist';

const promise = lazy((resolve, reject) => {
  const value = 1 + 1; // expensive task
  resolve(value);
});

// Executor hasn't run yet.
promise.then((value) => console.log('Executor has run and resolved:', value));
```

##### `lazy.fn(fn: Function): Promise`

Instead of taking an `executor`, `lazy.fn` takes a promise returning function that won't be executed until `promise.then()`, `promise.catch()`, or `promise.finally()` are called for the first time.

```javascript
import { lazy } from 'promist';

const promise = lazy.fn(() => Promise.resolve(10));

// Function hasn't run yet.
promise.then((value) => console.log('Executor has run and resolved:', value));
```

#### `immediate(): Promise`

Returns a promise that resolves in the next event loop (`setImmediate`).

```javascript
import { immediate } from 'promist';

immediate().then(() => console.log('Next event loop')).
```

### Compose functions

*Compose* functions mutate an input promise in order to provide some added functionality:

* They can optionally return a newly created promise: they take a second `create` argument -`false` by default.
* They might not work adequately if you're using non-standard methods for resolution other than `promise.then()`, `promise.catch()`, or `promise.finally()`.
* They can be chained via [`compose()`.](#composefns-function)

#### `deferrable(promise: Promise, create?: boolean): Promise`

* `promise` will acquire:
  * `promise.resolve(value: any)`: Resolves the promise with the given `value`.
  * `promise.reject(reason: any)`: Rejects the promise with the given `reason`.

If the input `promise` resolves or rejects before `promise.resolve()` or `promise.reject()` are called, they won't have any effect. If the opposite occurs, the resolution or rejection value of the input promise will be discarded.

```javascript
import { wait, deferrable } from 'promist';

const a = wait(100).then(() => 'Value 1');
deferrable(a);
a.resolve('Value 2');
a.then((val) => console.log('It will resolve with "Value 2"', val));

const b = Promise.resolve('Value 1');
deferrable(b);
wait(100).then(() => b.resolve('Value 2'));
b.then((val) => console.log('It will resolve with "Value 1"', val));
```

#### `cancellable(promise: Promise, create?: boolean): Promise`

* `promise` will acquire:
  * `promise.cancel()`: Cancels the promise.
  * `promise.cancelled`: *Boolean,* whether or not the promise has been cancelled.

```javascript
import { cancellable } from 'promist';

cancellable(myPromise);

// Cancel the promise
myPromise.cancel();
```

#### `status(promise: Promise, create?: boolean): Promise`

* `promise` will acquire:
  * `promise.status`: *String,* either `"pending"`, `"resolved"`, or `"rejected"`.
  * `promise.value`: Contains the resolution value. `null` if the promise is pending or rejected.
  * `promise.reason`: Contains the rejection reason. `null` if the promise is pending or resolved.

```javascript
import { status } from 'promist';

status(myPromise);
```

#### `timed(promise: Promise, create?: boolean): Promise`

* `promise` will acquire:
  * `promise.time`: *(Number|void),* the number of milliseconds it took the promise to resolve or reject. Defaults to `null` before it's resolved/rejected. The count starts the moment `timed()` is called.

```javascript
import { timed } from 'promist';

timed(myPromise);
```

#### `delay(ms: Number, delayRejection?: boolean): Function`

* `ms`: Threshold in milliseconds.
* `delayRejection`: Whether or not to also delay a promise rejection. Default: `false`.

Returns a function with signature: `(promise: Promise, create?: boolean): Promise`.

The returned promise will acquire a lower threshold in `ms` for promise resolution. If the original `promise` resolves before `ms`, the returned promise won't resolve until `ms` have passed; if it resolves after, it will resolve immediately. The count starts the moment `delay()()` is called.

```javascript
import { delay } from 'promist';

delay(500)(myPromise);

myPromise.then(() => {
  // Will be called once 500ms pass or whenever 'myPromise' resolves after that.
  // ...
})
```

#### `timeout(ms: Number, reason?: any): Function`

* `ms`: Threshold in milliseconds.
* `reason`: Value the promise will reject with if it doesn't fulfill in `ms` milliseconds:
  * If none is passed (`undefined`) or `false`, the promise will cancel (not resolve) instead of rejecting. For other *falsy* values, it will reject with the value.
  * If a *boolean,* it will reject with a default error when `true`, and cancel as if no `reason` was passed when `false`.

Returns a function with signature: `(promise: Promise, create?: boolean): Promise`.

The returned promise will acquire an upper threshold in `ms` after which, if it hasn't fulfilled, it will either cancel or reject, depending on whether a `reason` argument was passed. The count starts the moment `timeout()()` is called.

```javascript
import { timeout } from 'promist';

timeout(500)(promise1); // It will cancel if it hasn't been fulfilled in 500 ms
timeout(500, true)(promise2) // This one would reject with a default error
```

### Utils

#### `compose(...fns: Function[]): Function`

Takes in an unlimited number of *compose* functions as arguments, and returns a function with signature: `(promise: Promise, create?: boolean): Promise`.

```javascript
import { compose, cancellable, delay, deferrrable } from 'promist';

const p1 = compose(cancellable, delay(500), deferrable)(myPromise);
```

#### `control(test: Function, generator: Function): Function`

Used to control async flow. It returns a promise returning function taking the same arguments as `generator`.

* `test`: A test *function* (can be `async`) that will be run before calling each `next()` on `generator`, with signature  `() => Promise<boolean | Error> | boolean | Error`. It can return:
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

#### `isPromise(item: any): boolean`

Returns `true` if `object` is a *thenable,* `false` otherwise.

```javascript
import { isPromise } from 'promist';

isPromise(myPromise);
```

## Collections

* *Series:*
  * Collection functions execute serially.
  * The passed functions (callbacks) receive an array of promises.

* *Parallel:*
  * Collection functions execute in parallel in two stages: first, the resolution of all promises, then the passed function calls.
  * The passed functions (callbacks) receive an array with the values the input array of promises resolved to.
  * `parallel.reduce()` receives a promise as the accumulator parameter.

```javascript
import { parallel } from 'promist';
import { series } from 'promist';

parallel.map(myPromiseArr, (x, i, arr) => {
  // arr will contain the resolved values.
  return x;
});

series.map(myPromiseArr, (x, i, arr) => {
  // arr will be myPromiseArr
  return x;
})
```

### `map(arr: Promise[], callback: Function): Promise`

* `arr`: An array of promises.
* `callback`: With the same signature as [`Array.prototype.map()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) Can be a promise returning/*async* function.

### `filter(arr: Promise[], callback: Function): Promise`

* `arr`: An array of promises.
* `callback`: With the same signature as [`Array.prototype.filter()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) Can be a promise returning/*async* function.

### `reduce(arr: Promise[], callback: Function, initialValue: any): Promise`

* `arr`: An array of promises.
* `callback`: With the same signature as [`Array.prototype.reduce()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) Can be a promise returning/*async* function.
* `initialValue`: An initial value; if absent, the resolved value of the first promise in the array will be taken as `initialValue`.

### `each(arr: Promise[], callback: Function): Promise`

* `arr`: An array of promises.
* `callback`: With the same signature as [`Array.prototype.forEach()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Can be a promise returning/*async* function.
