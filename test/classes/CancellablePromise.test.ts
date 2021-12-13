import { test, expect, jest } from '@jest/globals';
import { AbortController } from 'abort-controller';
import { CancellablePromise } from '../../src/classes';

test(`succeeds wo/ cancel (sync)`, async () => {
  const error = Error();
  const p1 = new CancellablePromise((resolve) => {
    resolve('foo');
    return () => resolve('bar');
  });
  const p2 = new CancellablePromise((resolve, reject) => {
    reject(error);
    return () => resolve('bar');
  });

  await expect(p1).resolves.toBe('foo');
  await expect(p2).rejects.toBe(error);
});
test(`succeeds wo/ cancel (async)`, async () => {
  const error = Error();
  const p1 = new CancellablePromise((resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });
  const p2 = new CancellablePromise((resolve, reject) => {
    const timeout = setTimeout(() => reject(error), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });

  await expect(p1).resolves.toBe('foo');
  await expect(p2).rejects.toBe(error);
});
test(`succeeds w/ cancel`, async () => {
  const p = new CancellablePromise((resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });

  p.cancel();
  await expect(p).resolves.toBe('bar');
});
test(`succeeds w/ signal abort (before)`, async () => {
  const controller = new AbortController();
  controller.abort();

  const p = new CancellablePromise((resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  }, controller.signal);

  await expect(p).resolves.toBe('bar');
});
test(`succeeds w/ signal abort (after)`, async () => {
  const controller = new AbortController();
  const p = new CancellablePromise((resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  }, controller.signal);

  controller.abort();
  await expect(p).resolves.toBe('bar');
});
test(`cancellation doesn't cause signal abort`, async () => {
  const controller = new AbortController();
  const p = new CancellablePromise((resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  }, controller.signal);

  p.cancel();
  await expect(p).resolves.toBe('bar');
  expect(controller.signal.aborted).toBe(false);
});
test(`repeat calls to cancel don't cause repeat executions`, async () => {
  const fn = jest.fn();
  const p = new CancellablePromise(() => () => fn());

  expect(fn).toHaveBeenCalledTimes(0);
  p.cancel();
  expect(fn).toHaveBeenCalledTimes(1);
  p.cancel();
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`CancellablePromise.prototype[Symbol.toStringTag]: is "CancellablePromise"`, () => {
  const p = new CancellablePromise(() => () => undefined);
  expect(p[Symbol.toStringTag]).toBe('CancellablePromise');
});
