# Promist

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

## Basics

*Promist* intends to cover and abstract the most common day to day dealings with *async* behavior and promises. It doesn't intend to be the most complete library, or an incredibly slim one, but rather be a dependable set of functions that serve as go-to for most use cases.

* [*Create* functions:](#create-functions) return a new promise.
  * [`wait`](#waitms-number-promise)
  * [`until`](#untiltest-function-safe-boolean-ms-number-promise)
  * [`subscribe`](#subscribeobservable-observable-oncomplete-function-promise)
* [*Classes:*](#classes) both `Promist` and `LazyPromist` behave just like a `Promise`, but pack a few additional features.
  * [`Promist`](#promist-class)
  * [`LazyPromist`](#lazypromist-class)
  * [Static methods](#static-methods)
    * [`from`](#promistfrompromise-promise--function-promist)
    * [`wait`](#promistwaitms-number-promist)
    * [`until`](#promistuntiltest-function-safe-boolean-ms-number-promist)
    * [`subscribe`](#promistsubscribeobservable-observable-oncomplete-function-promist)
  * [Instance fields](#instance-fields)
    * [`status`](#promiststatus)
    * [`value`](#promistvalue)
    * [`reason`](#promistreason)
    * [`react`](#promistreact)
  * [Instance methods](#instance-methods)
    * [`resolve`](#promistresolvevalue-any-void)
    * [`reject`](#promistrejectreason-Error-void)
    * [`cancel`](#promistcancel-void)
    * [`timeout`](#promisttimeoutms-number-reason-error-void)
    * [`fallback`](#promistfallbackms-number-value-any-void)
* [*Utils:*](#utils) a set of conveniency utility functions.
  * [`control`](#controltest-function-generator-function-function)
  * [`isPromise`](#ispromisevalue-any-boolean)
* [*Collections*:](#collections) handled either in *parallel* or *series.*
  * [`map`](#maparr-promise-callback-function-promise)
  * [`filter`](#filterarr-promise-callback-function-promise)
  * [`reduce`](#reducearr-promise-callback-function-initialvalue-any-promise)
  * [`each`](#eacharr-promise-callback-function-promise)

## Create functions

*Create* functions return a new promise.

### `wait(ms: number): Promise`

Returns a promise that will resolve after `ms` milliseconds;

* `ms`: number of milliseconds to wait for until resolution.

```javascript
import { wait } from 'promist';

wait(100).then(() => console.log('Resolved after 100ms'));
```

### `until(test: Function, safe?: boolean, ms?: number): Promise`

Returns a promise that resolves when `test` returns `true`.

* `test`: test function, with signature `() => boolean | Promise<boolean>`.
* `safe`: if `true`, it will treat `test` throws and rejections as `false`, instead of rejecting itself.
* `ms`: the frequency `test` should be called at until it returns truthy. Default: `25`.

```javascript
import { until } from 'promist';

let example = 1;

until(() => example === 10)
  .then(() => console.log('Resolved after example = 10'));

example = 10;
```

### `subscribe(observable: Observable, onComplete?: Function): Promise`

Subscribes to an `observable` and resolves/rejects with its first value. By default, it will reject if the observable completes before emitting any values, though this behavior can be controlled via `onComplete`.

* `observable`: an *Observable* object.
* `onComplete`: a promise *executor* function, handling the event of the observable completing without emitting any values, and with signature: `(resolve: Function, reject: Function): void`.

```javascript
import { subscribe } from 'promist';
import { Subject } from 'rxjs';

const subject = new Subject();

subscribe(subject)
  .then(console.log); // foo

subject.next('foo');
```

## Classes

### `Promist` class

`Promist` behaves just like a `Promise`, but packs a few additional features.

* It can be externally resolved and/or rejected.
* It can also be externally cancelled. If using an executor on the `Promist` constructor, you can receive external completion events (resolution/rejection/cancellation) via the returned callback in order to free up resources, if needed. Externally, you also have access to this event -including cancellation- via the `Promist.react` promise.
* It will always have the `finally` method available, regardless of the underlying `Promise` implementation.

The difference between `Promist`s static methods and *create* functions is that in any completion event, they will always clean up after themselves, clearing the underlying timeouts and/or subscriptions.

Its *constructor* takes an optional *executor* function, just as
you would use to instantiate a normal promise.

```javascript
import { Promist } from 'promist';

const promist = new Promist((resolve, reject) => {
  // Counter will start on instantiation
  const timeout = setTimeout(() => resolve('foo'), 250);
  return function cleanup() {
    // Will run after the function resolves, rejects, or cancels
    clearTimeout(timeout);
  }
});
```

### `LazyPromist` class

Inherits from `Promist`, having the same *constructor* signature, with the diference of the *executor* not being optional. All of its static methods promises will execute lazily, as expected.

`LazyPromist`s don't run their constructor `executor` until after they've been explicitly expected to resolve by a `then`, `catch`, or `finally` call.

```javascript
import { LazyPromist } from 'promist';

const promist = new LazyPromist((resolve, reject) => {
  // Counter will start after `then`, `catch`, or `finally` are called.
  const timeout = setTimeout(() => resolve('foo'), 250);
  return function cleanup() {
    // Will run after the function resolves, rejects, or cancels
    clearTimeout(timeout);
  }
});
```

### Static methods

#### `Promist.from(promise: Promise | Function): Promist`

Creates a `Promist` from a `Promise` or a *sync* or *async* function.

* `promise`: a `Promise` or a function.

```javascript
import { Promist } from 'promist';

Promist.from(Promise.resolve('foo'));
Promist.from(async () => 'bar');
Promist.from(() => 'baz');
```

#### `Promist.wait(ms: number): Promist`

See [`wait`](#waitms-number-promise) and [the differences between `Promist` static methods and *create* functions.](#promist-class)

#### `Promist.until(test: Function, safe?: boolean, ms?: number): Promist`

See [`until`](#untiltest-function-safe-boolean-ms-number-promise) and [the differences between `Promist` static methods and *create* functions.](#promist-class)

#### `Promist.subscribe(observable: Observable, onComplete?: Function): Promist`

See [`subscribe`](#subscribeobservable-observable-oncomplete-function-promise) and [the differences between `Promist` static methods and *create* functions.](#promist-class)

### Instance fields

#### `promist.status`

Any of `'pending'`, `'resolved'`, `'rejected'` and `'cancelled'`.

#### `promist.value`

The value the promise has resolved to, if any. Otherwise `null`.

#### `promist.reason`

The reason the promise has rejected with, if any. Otherwise `null`.

#### `promist.react`

An empty promise that resolves once the promise has resolved, rejected, or has gotten cancelled.

### Instance methods

#### `promist.resolve(value?: any): void`

Resolves the `Promist` with `value`.

* `value`: the value to resolve to.

```javascript
import { Promist } from 'promist';

const promist = new Promist();

promist.then(console.log); // foo
promist.resolve('foo');
```

#### `promist.reject(reason: Error): void`

Rejects the `Promist` with `reason`.

* `reason`: the *Error* to reject with.

```javascript
import { Promist } from 'promist';

const promist = new Promist();

promist.catch(console.error); // Error: foo
promist.reject(Error('foo'));
```

#### `promist.cancel(): void`

Cancels the `Promist`. If it didn't already, it will never resolve nor reject.

```javascript
import { Promist } from 'promist';

const promist = new Promist((resolve) => {
  const timeout = setTimeout(resolve, 150);
  return () => clearTimeout(timeout);
});

promist.cancel();
promist.then(console.log); // will never execute `then` callback
```

#### `promist.timeout(ms: number, reason?: Error): void`

Sets a timeout of `ms` milliseconds after which, if the `Promist` hasn't resolved, rejected, or cancelled, it will reject with `reason`, or a default error if no `reason` is passed.

* `ms`: timeout in milliseconds.
* `reason`: *Error* to reject with.

```javascript
import { Promist } from 'promist';

const promist = new Promist((resolve) => {
  const timeout = setTimeout(resolve, 150);
  return () => clearTimeout(timeout);
});

promist.timeout(50);
promist.catch(console.error); // will reject
```

#### `promist.fallback(ms: number, value: any): void`

Sets a timeout of `ms` milliseconds after which, if the `Promist` hasn't resolved, rejected, or cancelled, it will resolve by falling back to `value`.

* `ms`: timeout in milliseconds.
* `value`: value to resolve with.

```javascript
import { Promist } from 'promist';

const promist = new Promist((resolve) => {
  const timeout = setTimeout(() => resolve('foo'), 150);
  return () => clearTimeout(timeout);
});

promist.fallback(50, 'bar');
promist.then(console.log); // 'bar'
```

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

Returns `true` if `value` is a *thenable,* `false` otherwise.

* `value`: *object* to test.

```javascript
import { isPromise } from 'promist';

if (isPromise(promise)) {
  promise.then(() => { /* ... */ });
}
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

parallel.map(promiseArr, (x, i, arr) => {
  // arr will contain the resolved values.
  return x;
});

series.map(promiseArr, (x, i, arr) => {
  // arr will be promiseArr
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
