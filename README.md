# Promist

[![Version](https://img.shields.io/github/package-json/v/rafamel/promist.svg)](https://github.com/rafamel/promist)
[![Build Status](https://travis-ci.org/rafamel/promist.svg)](https://travis-ci.org/rafamel/promist)
[![Coverage](https://img.shields.io/coveralls/rafamel/promist.svg)](https://coveralls.io/github/rafamel/promist)
[![Dependencies](https://david-dm.org/rafamel/promist/status.svg)](https://david-dm.org/rafamel/promist)
[![Vulnerabilities](https://snyk.io/test/npm/promist/badge.svg)](https://snyk.io/test/npm/promist)
[![Issues](https://img.shields.io/github/issues/rafamel/promist.svg)](https://github.com/rafamel/promist/issues)
[![License](https://img.shields.io/github/license/rafamel/promist.svg)](https://github.com/rafamel/promist/blob/master/LICENSE)

<!-- markdownlint-disable MD036 -->
**A dependable Promises and async utility belt.** Not a `Promise` implementation.
<!-- markdownlint-enable MD036 -->

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
    * [`isPromise()`](#ispromiseobject-any-boolean)
* [*Collections*:](#collections) Handled either in *parallel* or *series.*
  * [`map()`](#maparr-promise-callback-function-promise)
  * [`filter()`](#filterarr-promise-callback-function-promise)
  * [`reduce()`](#reducearr-promise-callback-function-initialvalue-any-promise)
  * [`each()`](#eacharr-promise-callback-function-promise)

You can either `import` directly from the package root (as shown in the examples below), or:

```javascript
import { /* create functions to import */ } from 'promist/create';
import { /* compose functions to import */ } from 'promist/compose';
import { /* utils to import */ } from 'promist/utils';
import parallel, { /* or the parallel function to import */ } from 'promist/parallel';
import series, { /* or the series function to import */ }  from 'promist/series';
```

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

#### `immediate(): Promise`

Returns a promise that resolves in the next event loop (`setImmediate`).

```javascript
import { immediate } from 'promist';

immediate().then(() => console.log('Next event loop')).
```

### Compose functions

*Compose* functions mutate an input promise in order to provide some added functionality:

* They might not work adecuately if you're using non-standard methods for resolution other than `promise.then()`, `promise.catch()`, or `promise.finally()`.
* They can be chained via [`compose()`.](#composefns-function)

#### `deferrable(promise: Promise): Promise`

* `promise` will acquire:
  * `promise.resolve(value: any)`: Resolves the promise with the given `value`.
  * `promise.reject(reason: any)`: Rejects the promise with the given `reason`.

If the input `promise` resolves or rejects before `promise.resolve()` or `promise.reject()` are called, they won't have any effect. If the opposite ocurrs, the resolution or rejection value of the input promise will be discarded.

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

#### `cancellable(promise: Promise): Promise`

* `promise` will acquire:
  * `promise.cancel()`: Cancels the promise.
  * `promise.cancelled`: *Boolean,* whether or not the promise has been cancelled.

```javascript
import { cancellable } from 'promist';

cancellable(myPromise);

// Cancel the promise
myPromise.cancel();
```

#### `status(promise: Promise): Promise`

* `promise` will acquire:
  * `promise.status`: *String,* either `"pending"`, `"resolved"`, or `"rejected"`.
  * `promise.value`: Contains the resolution value. `null` if the promise is pending or rejected.
  * `promise.reason`: Contains the rejection reason. `null` if the promise is pending or resolved.

```javascript
import { status } from 'promist';

status(myPromise);
```

#### `timed(promise: Promise): Promise`

* `promise` will acquire:
  * `promise.time`: *(Number|void),* the number of milliseconds it took the promise to resolve or reject. Defaults to `null` before it's resolved/rejected. The count starts the moment `timed()` is called.

```javascript
import { timed } from 'promist';

timed(myPromise);
```

#### `delay(ms: Number, delayRejection?: boolean): Function`

* `ms`: Threshold in milliseconds.
* `delayRejection`: Whether or not to also delay a promise rejection. Default: `false`.

Returns a function with signature: `(promise: Promise): Promise`.

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
* `reason`: Value the promise will reject with if it doesn't fulfill in `ms`. If none is passed, it will cancel instead of reject.

Returns a function with signature: `(promise: Promise): Promise`.

The returned promise will acquire an upper threshold in `ms` after which, if it hasn't fulfilled, it will either cancel or reject, depending on whether a `reason` argument was passed. The count starts the moment `timeout()()` is called.

```javascript
import { timeout } from 'promist';

timeout(500)(myPromise);
```

### Utils

#### `compose(...fns: Function[]): Function`

Takes in an unlimited number of *compose* functions as arguments, and returns a function that should receive the promise to mutate.

```javascript
import { compose, cancellable, delay, deferrrable } from 'promist';

const p1 = compose(cancellable, delay(500), deferrable)(myPromise);
```

#### `isPromise(object: any): boolean`

Returns `true` if `object` is a *thenable,* `false` otherwise.

```javascript
import { isPromise } from 'promist';

isPromise(myPromise);
```

## Collections

* *Series* collection functions execute serially. The passed functions (callbacks) receive an array of promises.
* *Parallel* collection functions execute in parallel in two stages: first, the resolution of all promises, then the passed function calls (`parallel.reduce()` executes this serially). The passed functions (callbacks) receive an array with the values the input array of promises resolved to.

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