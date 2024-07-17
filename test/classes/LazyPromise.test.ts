import { expect, test, vi } from 'vitest';

import { LazyPromise } from '../../src/classes';

test(`Executor: executor doesn't run on instantiation`, async () => {
  const fn: any = vi.fn();
  const p = new LazyPromise(fn);
  await new Promise((resolve) => setTimeout(resolve, 150));
  expect(fn).not.toHaveBeenCalled();
  p.then(() => undefined);
});
test(`Executor: runs on then`, async () => {
  const p = new LazyPromise((resolve) => resolve('foo'));
  const fn = vi.fn();
  await p.then(fn);
  expect(fn).toHaveBeenCalledWith('foo');
});
test(`Executor: runs on catch`, async () => {
  const p = new LazyPromise((_resolve, reject) => reject(new Error('foo')));
  const fn = vi.fn();
  await p.catch(fn);
  expect(fn.mock.calls[0][0]).toHaveProperty('message', 'foo');
});
test(`Executor: runs on finally`, async () => {
  const p = new LazyPromise((resolve) => resolve('foo'));
  const fn = vi.fn();
  await p.finally(fn);
  expect(fn).toHaveBeenCalled();
});
test(`Executor: only runs once`, async () => {
  const fn = vi.fn();
  const p = new LazyPromise((resolve) => {
    fn();
    resolve('foo');
  });
  await p.catch(() => undefined);
  await p.then(() => undefined);
  await p.finally(() => undefined);

  await expect(p).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`LazyPromise.prototype[Symbol.toStringTag]: is "LazyPromise"`, () => {
  const p = new LazyPromise(() => undefined);
  expect(p[Symbol.toStringTag]).toBe('LazyPromise');
});
test(`LazyPromise.from: callback doesn't run until requested`, async () => {
  const fn = vi.fn();
  const p = LazyPromise.from(() => {
    fn();
    return 'foo';
  });

  expect(fn).not.toHaveBeenCalled();
  await expect(p).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(1);
});
