import { test, expect } from '@jest/globals';
import { DeferredPromise } from '../../src/classes';

test(`DeferredPromise.prototype[Symbol.toStringTag]: is "DeferredPromise"`, () => {
  const p = new DeferredPromise();
  expect(p[Symbol.toStringTag]).toBe('DeferredPromise');
});
test(`DeferredPromise.prototype.resolve: resolves promise`, async () => {
  const p = new DeferredPromise();
  p.resolve('foo');
  await expect(p).resolves.toBe('foo');
});
test(`DeferredPromise.prototype.reject: rejects promise`, async () => {
  const p = new DeferredPromise();
  const error = new Error();
  p.reject(error);
  await expect(p).rejects.toBe(error);
});
