import { LazyPromist } from '~/classes';

describe(`instace`, () => {
  describe(`laziness`, () => {
    test(`executor doesn't run on instantiation`, async () => {
      const fn = jest.fn();
      const p = new LazyPromist(fn);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(fn).not.toHaveBeenCalled();
      p.then(() => {});
    });
    test(`executor runs on then`, async () => {
      const p = new LazyPromist((resolve) => resolve('foo'));
      const fn = jest.fn();
      await p.then(fn);
      expect(fn).toHaveBeenCalledWith('foo');
    });
    test(`executor runs on catch`, async () => {
      const p = new LazyPromist((resolve, reject) => reject(Error(`foo`)));
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
      await p.catch(() => {});
      await p.then(() => {});
      await p.finally(() => {});

      await expect(p).resolves.toBe('foo');
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test(`executor never runs on early resolution`, async () => {
      const fn = jest.fn();
      const p = new LazyPromist(fn);
      p.resolve('foo');
      await expect(p).resolves.toBe('foo');
      expect(fn).not.toHaveBeenCalled();
    });
    test(`executor never runs on early rejection`, async () => {
      const fn = jest.fn();
      const p = new LazyPromist(fn);
      p.reject(Error('foo'));
      await expect(p).rejects.toThrowError('foo');
      expect(fn).not.toHaveBeenCalled();
    });
    test(`executor never runs on early cancellation`, async () => {
      const fn = jest.fn();
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
      p.then(() => {});
      p.resolve('bar');

      await expect(p).resolves.toBe('bar');
      expect(fn).toHaveBeenCalled();
    });
  });
  describe(`then, catch, finally, promises`, () => {
    test(`then is a Promise, not a LazyPromise`, () => {
      const p = LazyPromist.from(() => {});

      expect(p.then(() => {})).toBeInstanceOf(Promise);
      expect(p.then(() => {})).not.toBeInstanceOf(LazyPromist);
    });
    test(`catch is a Promise, not a LazyPromise`, () => {
      const p = LazyPromist.from(() => {});
      expect(p.catch(() => {})).toBeInstanceOf(Promise);
      expect(p.catch(() => {})).not.toBeInstanceOf(LazyPromist);
    });
    test(`finally is a Promise, not a LazyPromise`, () => {
      const p = LazyPromist.from(() => {});
      expect(p.finally(() => {})).toBeInstanceOf(Promise);
      expect(p.finally(() => {})).not.toBeInstanceOf(LazyPromist);
    });
  });
  describe(`timeout`, () => {
    test(`runs if executor already run`, async () => {
      const p = new LazyPromist(() => {});
      p.catch(() => {});
      p.timeout(50, Error('foo'));
      await expect(p).rejects.toThrowError('foo');
    });
    test(`runs after executor does if it didn't run`, async () => {
      const p = new LazyPromist(() => {});
      p.timeout(150, Error('foo'));
      await new Promise((resolve) => setTimeout(resolve, 200));

      const start = Date.now();
      await expect(p).rejects.toThrowError('foo');
      expect(Date.now() - start).toBeGreaterThanOrEqual(150);
      expect(Date.now() - start).toBeLessThan(250);
    });
    test(`earlier trumps later fallback/timeout`, async () => {
      const p = new LazyPromist(() => {});
      p.timeout(50, Error(`baz`));
      p.fallback(150, 'bar');
      p.timeout(100, Error('foo'));

      await expect(p).rejects.toThrowError('baz');
    });
  });
  describe(`fallback`, () => {
    test(`runs if executor already run`, async () => {
      const p = new LazyPromist(() => {});
      p.then(() => {});
      p.fallback(50, 'foo');
      await expect(p).resolves.toBe('foo');
    });
    test(`runs after executor does if it didn't run`, async () => {
      const p = new LazyPromist(() => {});
      p.fallback(150, 'foo');
      await new Promise((resolve) => setTimeout(resolve, 200));

      const start = Date.now();
      await expect(p).resolves.toBe('foo');
      expect(Date.now() - start).toBeGreaterThanOrEqual(150);
      expect(Date.now() - start).toBeLessThan(250);
    });
    test(`earlier trumps later fallback/timeout`, async () => {
      const p = new LazyPromist(() => {});
      p.fallback(100, 'foo');
      p.timeout(150, Error(`bar`));
      p.fallback(50, 'baz');

      await expect(p).resolves.toBe('baz');
    });
  });
});
