import { test, describe, expect, jest } from '@jest/globals';
import { LazyPromist } from '../../src/classes';
import { Subject } from 'rxjs';

describe(`laziness`, () => {
  test(`executor doesn't run on instantiation`, async () => {
    const fn: any = jest.fn();
    const p = new LazyPromist(fn);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(fn).not.toHaveBeenCalled();
    p.then(() => undefined);
  });
  test(`executor runs on then`, async () => {
    const p = new LazyPromist((resolve) => resolve('foo'));
    const fn = jest.fn();
    await p.then(fn);
    expect(fn).toHaveBeenCalledWith('foo');
  });
  test(`executor runs on catch`, async () => {
    const p = new LazyPromist((_resolve, reject) => reject(Error(`foo`)));
    const fn = jest.fn();
    await p.catch(fn);
    expect(fn.mock.calls[0][0]).toHaveProperty('message', 'foo');
  });
  test(`executor runs on finally`, async () => {
    const p = new LazyPromist((resolve) => resolve('foo'));
    const fn = jest.fn();
    await p.finally(fn);
    expect(fn).toHaveBeenCalled();
  });
  test(`executor only runs once`, async () => {
    const fn = jest.fn();
    const p = new LazyPromist((resolve) => {
      fn();
      resolve('foo');
    });
    await p.catch(() => undefined);
    await p.then(() => undefined);
    await p.finally(() => undefined);

    await expect(p).resolves.toBe('foo');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`executor never runs on early resolution`, async () => {
    const fn: any = jest.fn();
    const p = new LazyPromist(fn);
    p.resolve('foo');
    await expect(p).resolves.toBe('foo');
    expect(fn).not.toHaveBeenCalled();
  });
  test(`executor never runs on early rejection`, async () => {
    const fn: any = jest.fn();
    const p = new LazyPromist(fn);
    p.reject(Error('foo'));
    await expect(p).rejects.toThrowError('foo');
    expect(fn).not.toHaveBeenCalled();
  });
  test(`executor never runs on early cancellation`, async () => {
    const fn: any = jest.fn();
    const p = new LazyPromist(fn);
    p.cancel();
    p.then(fn);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(fn).not.toHaveBeenCalled();
  });
});
describe(`executor cleanup`, () => {
  test(`executor cleanup runs`, async () => {
    const fn = jest.fn();
    const p = new LazyPromist((resolve) => {
      resolve('foo');
      return fn;
    });

    await expect(p).resolves.toBe('foo');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`executor cleanup only runs once`, async () => {
    const fn = jest.fn();
    const p = new LazyPromist((resolve) => {
      resolve('foo');
      return fn;
    });

    await expect(p).resolves.toBe('foo');
    await expect(p).resolves.toBe('foo');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`still cleans up if executor run but it's externally resolved earlier`, async () => {
    const fn = jest.fn();
    const p = new LazyPromist((resolve) => {
      setTimeout(() => resolve('foo'), 150);
      return fn;
    });
    p.then(() => undefined);
    p.resolve('bar');

    await expect(p).resolves.toBe('bar');
    expect(fn).toHaveBeenCalled();
  });
});
describe(`then, catch, finally, promises`, () => {
  test(`then is a Promise, not a LazyPromise`, () => {
    const p = LazyPromist.from(() => undefined);

    expect(p.then(() => undefined)).toBeInstanceOf(Promise);
    expect(p.then(() => undefined)).not.toBeInstanceOf(LazyPromist);
  });
  test(`catch is a Promise, not a LazyPromise`, () => {
    const p = LazyPromist.from(() => undefined);
    expect(p.catch(() => undefined)).toBeInstanceOf(Promise);
    expect(p.catch(() => undefined)).not.toBeInstanceOf(LazyPromist);
  });
  test(`finally is a Promise, not a LazyPromise`, () => {
    const p = LazyPromist.from(() => undefined);
    expect(p.finally(() => undefined)).toBeInstanceOf(Promise);
    expect(p.finally(() => undefined)).not.toBeInstanceOf(LazyPromist);
  });
});
describe(`timeout`, () => {
  test(`runs if executor already run`, async () => {
    const p = new LazyPromist(() => undefined);
    p.catch(() => undefined);
    p.timeout(50, Error('foo'));
    await expect(p).rejects.toThrowError('foo');
  });
  test(`runs after executor does if it didn't run`, async () => {
    const p = new LazyPromist(() => undefined);
    p.timeout(200, Error('foo'));
    await new Promise((resolve) => setTimeout(resolve, 250));

    const start = Date.now();
    await expect(p).rejects.toThrowError('foo');
    expect(Date.now() - start).toBeGreaterThanOrEqual(200);
    expect(Date.now() - start).toBeLessThan(400);
  });
  test(`earlier trumps later fallback/timeout`, async () => {
    const p = new LazyPromist(() => undefined);
    p.timeout(50, Error(`baz`));
    p.fallback(150, 'bar');
    p.timeout(100, Error('foo'));

    await expect(p).rejects.toThrowError('baz');
  });
});
describe(`fallback`, () => {
  test(`runs if executor already run`, async () => {
    const p = new LazyPromist(() => undefined);
    p.then(() => undefined);
    p.fallback(50, 'foo');
    await expect(p).resolves.toBe('foo');
  });
  test(`runs after executor does if it didn't run`, async () => {
    const p = new LazyPromist(() => undefined);
    p.fallback(200, 'foo');
    await new Promise((resolve) => setTimeout(resolve, 250));

    const start = Date.now();
    await expect(p).resolves.toBe('foo');
    expect(Date.now() - start).toBeGreaterThanOrEqual(200);
    expect(Date.now() - start).toBeLessThan(400);
  });
  test(`earlier trumps later fallback/timeout`, async () => {
    const p = new LazyPromist(() => undefined);
    p.fallback(100, 'foo');
    p.timeout(150, Error(`bar`));
    p.fallback(50, 'baz');

    await expect(p).resolves.toBe('baz');
  });
});
describe(`static methods`, () => {
  test(`from callback doesn't run until requested`, async () => {
    const fn = jest.fn();
    const p = LazyPromist.from(() => {
      fn();
      return 'foo';
    });

    expect(fn).not.toHaveBeenCalled();
    await expect(p).resolves.toBe('foo');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`wait doesn't start until requested`, async () => {
    const p = LazyPromist.wait(200);

    await new Promise((resolve) => setTimeout(resolve, 250));
    const start = Date.now();
    await expect(p).resolves.toBe(undefined);
    expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  });
  test(`until doesn't start until requested`, async () => {
    const fn: any = jest.fn();
    const p = LazyPromist.until(fn);

    expect(fn).not.toHaveBeenCalled();
    p.then(() => undefined);
    p.cancel();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`subscribe doesn't start until requested`, async () => {
    const subject = new Subject();
    const p = LazyPromist.subscribe(subject);
    subject.next('foo');

    p.then(() => undefined);
    subject.next('bar');
    await expect(p).resolves.toBe('bar');
  });
});
