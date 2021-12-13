import { test, expect, jest } from '@jest/globals';
import { ExtensiblePromise } from '../../src/classes';

test(`ExtensiblePromise.prototype: mimics Promise`, () => {
  const s = Promise.resolve();
  const p = new ExtensiblePromise(() => undefined);

  expect(JSON.stringify(s)).toBe(JSON.stringify(p));
  expect(Object.getOwnPropertyNames(s)).toEqual(Object.getOwnPropertyNames(p));
  expect(Object.getOwnPropertyNames(Object.getPrototypeOf(s))).toEqual(
    Object.getOwnPropertyNames(Object.getPrototypeOf(p))
  );
});
test(`ExtensiblePromise.prototype[Symbol.toStringTag]: is "ExtensiblePromise"`, () => {
  const p = new ExtensiblePromise(() => undefined);
  expect(p[Symbol.toStringTag]).toBe('ExtensiblePromise');
});
test(`ExtensiblePromise.prototype.then: is a Promise, not a ExtensiblePromise`, () => {
  const p = new ExtensiblePromise(() => undefined);

  expect(p.then(() => undefined)).toBeInstanceOf(Promise);
  expect(p.then(() => undefined)).not.toBeInstanceOf(ExtensiblePromise);
});
test(`ExtensiblePromise.prototype.then: resolves with value`, async () => {
  const err = Error();
  const p1 = new ExtensiblePromise((resolve) => resolve('foo'));
  const p2 = new ExtensiblePromise((_, reject) => reject(err));

  await expect(p1.then((val) => val)).resolves.toBe('foo');
  await expect(p2.then(null, (val) => val)).resolves.toBe(err);
});
test(`ExtensiblePromise.prototype.catch: is a Promise, not a ExtensiblePromise`, () => {
  const p = new ExtensiblePromise(() => undefined);
  expect(p.catch(() => undefined)).toBeInstanceOf(Promise);
  expect(p.catch(() => undefined)).not.toBeInstanceOf(ExtensiblePromise);
});
test(`ExtensiblePromise.prototype.catch: resolves with value`, async () => {
  const err = Error();
  const p = new ExtensiblePromise((_, reject) => reject(err));

  await expect(p.catch((val) => val)).resolves.toBe(err);
});
test(`ExtensiblePromise.prototype.finally: is a Promise, not a ExtensiblePromise`, () => {
  const p = new ExtensiblePromise(() => undefined);
  expect(p.finally(() => undefined)).toBeInstanceOf(Promise);
  expect(p.finally(() => undefined)).not.toBeInstanceOf(ExtensiblePromise);
});
test(`ExtensiblePromise.prototype.catch: always executes`, async () => {
  const fn1 = jest.fn();
  const fn2 = jest.fn();
  const p1 = new ExtensiblePromise((resolve) => resolve('foo'));
  const p2 = new ExtensiblePromise((_, reject) => reject(Error()));

  await p1.finally(fn1);
  await p2.finally(fn2).catch(() => undefined);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(1);
});
