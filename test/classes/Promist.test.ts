import { Promist } from '~/classes';
import { Observable } from 'rxjs';

describe(`instance`, () => {
  describe(`mimics Promise`, () => {
    const s = Promise.resolve();
    const p = new Promist();

    expect(String(s)).toBe(String(p));
    expect(JSON.stringify(s)).toBe(JSON.stringify(p));
  });
  describe(`getters`, () => {
    test(`initial state as expected`, () => {
      const p = new Promist();
      expect(p.status).toBe('pending');
      expect(p.value).toBe(null);
      expect(p.reason).toBe(null);
    });
    test(`state doesn't mutate`, () => {
      const p = new Promist();
      expect(() => Object.assign(p, { status: 'value' })).toThrowError();
      expect(() => Object.assign(p, { value: 'value' })).toThrowError();
      expect(() => Object.assign(p, { reason: 'value' })).toThrowError();
    });
  });
  describe(`then, catch, finally, promises`, () => {
    test(`then and finally get called on resolve, not catch`, async () => {
      const p = new Promist((resolve) => resolve('foo'));

      const fn = jest.fn();
      p.catch(fn);
      await expect(p.then((x) => x, fn)).resolves.toBe('foo');
      await expect(p.then((x) => x)).resolves.toBe('foo');
      await expect(p.finally(() => undefined)).resolves.toBe('foo');
      expect(fn).not.toHaveBeenCalled();
    });
    test(`catch and finally get called on reject, not then`, async () => {
      const p = new Promist((resolve, reject) => reject(Error('foo')));

      const fn = jest.fn();
      p.then(fn).catch(() => {});
      await expect(p.then(fn, (x) => Promise.reject(x))).rejects.toThrowError(
        'foo'
      );
      await expect(p.catch((x) => Promise.reject(x))).rejects.toThrowError(
        'foo'
      );
      await expect(p.finally(() => undefined)).rejects.toThrowError('foo');
      expect(fn).not.toHaveBeenCalled();
    });
    test(`then is a Promise, not a Promist`, () => {
      const p = new Promist();

      expect(p.then(() => {})).toBeInstanceOf(Promise);
      expect(p.then(() => {})).not.toBeInstanceOf(Promist);
    });
    test(`catch is a Promise, not a Promist`, () => {
      const p = new Promist();

      expect(p.catch(() => {})).toBeInstanceOf(Promise);
      expect(p.catch(() => {})).not.toBeInstanceOf(Promist);
    });
    test(`finally is a Promise, not a Promist`, () => {
      const p = new Promist();

      expect(p.finally(() => {})).toBeInstanceOf(Promise);
      expect(p.finally(() => {})).not.toBeInstanceOf(Promist);
    });
  });
  describe(`resolution`, () => {
    test(`resolves outside`, async () => {
      const p = new Promist();
      p.resolve('foo');
      await expect(p).resolves.toBe('foo');
      expect([p.status, p.value, p.reason]).toEqual(['resolved', 'foo', null]);
    });
    test(`resolves inside`, async () => {
      const p = new Promist((resolve) => resolve('foo'));
      await expect(p).resolves.toBe('foo');
      expect([p.status, p.value, p.reason]).toEqual(['resolved', 'foo', null]);
    });
    test(`doesn't fail when resolving twice`, async () => {
      const p = new Promist((resolve, reject) => {
        resolve('foo');
        reject(Error());
        resolve('bar');
      });
      p.resolve('baz');
      p.reject(Error());
      await expect(p).resolves.toBe('foo');
      expect([p.status, p.value, p.reason]).toEqual(['resolved', 'foo', null]);
    });
  });
  describe(`rejection`, () => {
    test(`rejects outside`, async () => {
      const p = new Promist();
      p.reject(Error('foo'));
      await expect(p).rejects.toThrowError('foo');
      expect([p.status, p.value]).toEqual(['rejected', null]);
      expect(p.reason).toHaveProperty('message', 'foo');
    });
    test(`rejects inside`, async () => {
      const p = new Promist((resolve, reject) => reject(Error('foo')));
      await expect(p).rejects.toThrowError('foo');
      expect([p.status, p.value]).toEqual(['rejected', null]);
      expect(p.reason).toHaveProperty('message', 'foo');
    });
    test(`doesn't fail when rejecting twice`, async () => {
      const p = new Promist((resolve, reject) => {
        reject(Error('foo'));
        resolve('baz');
        reject(Error('bar'));
      });
      p.resolve('');
      p.reject(Error(''));
      await expect(p).rejects.toThrowError('foo');
      expect([p.status, p.value]).toEqual(['rejected', null]);
      expect(p.reason).toHaveProperty('message', 'foo');
    });
  });
  describe(`cancellation`, () => {
    test(`cancels promise on resolution`, async () => {
      const p = new Promist();
      p.cancel();
      p.resolve('foo');
      const fn = jest.fn();
      p.then(fn);
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(fn).not.toHaveBeenCalled();
      expect([p.status, p.value, p.reason]).toEqual(['cancelled', null, null]);
    });
    test(`cancels promise on rejection`, async () => {
      const p = new Promist();
      p.cancel();
      p.reject(Error(`foo`));
      const fn = jest.fn();
      p.catch(fn);
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(fn).not.toHaveBeenCalled();
      expect([p.status, p.value, p.reason]).toEqual(['cancelled', null, null]);
    });
    test(`doesn't cancel after resolution`, async () => {
      const p = new Promist();
      p.resolve('foo');
      p.cancel();
      await expect(p).resolves.toBe('foo');
      expect([p.status, p.value, p.reason]).toEqual(['resolved', 'foo', null]);
    });
    test(`doesn't cancel after rejection`, async () => {
      const p = new Promist();
      p.reject(Error('foo'));
      p.cancel();
      await expect(p).rejects.toThrowError('foo');
      expect([p.status, p.value]).toEqual(['rejected', null]);
      expect(p.reason).toHaveProperty('message', 'foo');
    });
  });
  describe(`executor cleanup and react`, () => {
    test(`don't execute on no state change`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist(() => fns[0]);
      p.react.then(fns[1]);

      await new Promise((resolve) => setTimeout(resolve, 250));
      expect(fns[0]).not.toHaveBeenCalled();
      expect(fns[1]).not.toHaveBeenCalled();
    });
    test(`execute on internal resolution`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist((resolve) => {
        resolve('foo');
        return fns[0];
      });

      await p.react.then(fns[1]);
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
    test(`execute on external resolution`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist<void>(() => fns[0]);
      const pr = p.react.then(fns[1]);
      p.resolve();

      await pr;
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
    test(`execute on internal rejection`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist((resolve, reject) => {
        reject(Error('foo'));
        return fns[0];
      });

      await p.catch(() => {});
      await p.react.then(fns[1]);
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
    test(`execute on external rejection`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist(() => fns[0]);
      const pr = p.react.then(fns[1]);
      p.reject(Error('foo'));

      await p.catch(() => {});
      await pr;
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
    test(`execute on cancellation`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist(() => fns[0]);
      const pr = p.react.then(fns[1]);
      p.cancel();

      await pr;
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
    test(`don't execute more than once`, async () => {
      const fns = [jest.fn(), jest.fn()];
      const p = new Promist<void>((resolve, reject) => {
        resolve();
        reject(Error(`foo`));
        return fns[0];
      });
      p.resolve();
      p.reject(Error(`bar`));
      p.cancel();

      await p.react.then(fns[1]);
      expect(fns[0]).toHaveBeenCalledTimes(1);
      expect(fns[1]).toHaveBeenCalledTimes(1);
    });
  });
  describe(`timeout`, () => {
    test(`doesn't have an effect if it resolves beforehand`, async () => {
      const p = new Promist();
      p.timeout(25);
      p.resolve('foo');
      p.timeout(25);
      await expect(p).resolves.toBe('foo');
    });
    test(`doesn't have an effect if it rejects beforehand`, async () => {
      const p = new Promist();
      p.timeout(25);
      p.reject(Error(`foo`));
      p.timeout(25);
      await expect(p).rejects.toThrowError('foo');
    });
    test(`doesn't have an effect if gets been cancelled`, async () => {
      const p = new Promist();
      p.timeout(25);
      p.cancel();
      p.timeout(25);

      const fn = jest.fn();
      p.then(fn);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(fn).not.toHaveBeenCalled();
    });
    test(`rejects on timeout w/ default error`, async () => {
      const p = new Promist();
      p.timeout(25);
      await expect(p).rejects.toThrowError('Promise timed out');
    });
    test(`rejects on timeout w/ custom error`, async () => {
      const p = new Promist();
      p.timeout(25, Error('foo'));
      await expect(p).rejects.toThrowError('foo');
    });
  });
  describe(`fallback`, () => {
    test(`doesn't have an effect if it resolves beforehand`, async () => {
      const p = new Promist();
      p.fallback(25, 'bar');
      p.resolve('foo');
      p.fallback(25, 'bar');
      await expect(p).resolves.toBe('foo');
    });
    test(`doesn't have an effect if it rejects beforehand`, async () => {
      const p = new Promist();
      p.fallback(25, 'bar');
      p.reject(Error(`foo`));
      p.fallback(25, 'bar');
      await expect(p).rejects.toThrowError('foo');
    });
    test(`doesn't have an effect if it gets cancelled`, async () => {
      const p = new Promist();
      p.fallback(25, 'foo');
      p.cancel();
      p.fallback(25, 'foo');

      const fn = jest.fn();
      p.then(fn);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(fn).not.toHaveBeenCalled();
    });
    test(`resolves with fallback value`, async () => {
      const p = new Promist();
      p.fallback(25, 'foo');
      await expect(p).resolves.toBe('foo');
    });
  });
});

describe(`static methods`, () => {
  describe(`from`, () => {
    test(`from promise`, async () => {
      const p = Promist.from(Promise.resolve('foo'));

      expect(p).toBeInstanceOf(Promist);
      await expect(p).resolves.toBe('foo');
    });
    test(`from promise returning sync function`, async () => {
      const p = Promist.from(() => Promise.resolve('foo'));

      expect(p).toBeInstanceOf(Promist);
      await expect(p).resolves.toBe('foo');
    });
    test(`from sync throwing function`, async () => {
      const p = Promist.from(() => {
        throw Error(`foo`);
      });
      expect(p).toBeInstanceOf(Promist);
      await expect(p).rejects.toThrowError('foo');
    });
    test(`from async function`, async () => {
      const p = Promist.from(async () => 'foo');

      expect(p).toBeInstanceOf(Promist);
      await expect(p).resolves.toBe('foo');
    });
  });
  describe(`subscribe`, () => {
    test(`resolves with next`, async () => {
      const fn = jest.fn();
      const obs = new Observable((self) => {
        self.next('foo');
        return fn;
      });

      await expect(Promist.subscribe(obs)).resolves.toBe('foo');
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test(`rejects with error`, async () => {
      const fn = jest.fn();
      const obs = new Observable((self) => {
        self.error(Error(`foo`));
        return fn;
      });

      await expect(Promist.subscribe(obs)).rejects.toThrowError('foo');
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test(`rejects on complete before emitting a value`, async () => {
      const fn = jest.fn();
      const obs = new Observable((self) => {
        self.complete();
        return fn;
      });

      await expect(Promist.subscribe(obs)).rejects.toThrowError();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fn).toHaveBeenCalledTimes(1);
    });
    test(`unsubscribes on cancellation`, async () => {
      const fn = jest.fn();
      const obs = new Observable(() => fn);
      const p = Promist.subscribe(obs);
      p.cancel();

      await p.react;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
  describe(`until`, () => {
    test(`unsafe resolves`, async () => {
      let val = false;
      const p = Promist.until(() => val);

      setTimeout(() => (val = true), 150);
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeGreaterThanOrEqual(150);
      expect(Date.now() - start).toBeLessThan(250);
    });
    test(`unsafe rejects on sync throw`, async () => {
      const p = Promist.until(() => {
        throw Error(`foo`);
      });
      await expect(p).rejects.toThrowError('foo');
    });
    test(`unsafe rejects on promise rejection`, async () => {
      const p = Promist.until(() => Promise.reject(Error('foo')));
      await expect(p).rejects.toThrowError('foo');
    });
    test(`safe takes throws as false`, async () => {
      let val = false;
      const p = Promist.until(() => {
        if (!val) throw Error(`foo`);
        return true;
      }, true);

      setTimeout(() => (val = true), 150);
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeGreaterThanOrEqual(150);
      expect(Date.now() - start).toBeLessThan(250);
    });
    test(`safe takes rejections as false`, async () => {
      let val = false;
      const p = Promist.until(() => val || Promise.reject(Error(`foo`)), true);

      setTimeout(() => (val = true), 150);
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeGreaterThanOrEqual(150);
      expect(Date.now() - start).toBeLessThan(250);
    });
    test(`allows for external manipulation`, async () => {
      let val = false;
      const p = Promist.until(() => val);

      setTimeout(() => p.resolve(), 50);
      setTimeout(() => (val = true), 150);
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeGreaterThanOrEqual(50);
      expect(Date.now() - start).toBeLessThan(150);
    });
  });
  describe(`wait`, () => {
    test(`waits`, async () => {
      const p = Promist.wait(250);
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeGreaterThanOrEqual(250);
      expect(Date.now() - start).toBeLessThan(350);
    });
    test(`allows for external manipulation`, async () => {
      const p = Promist.wait(250);
      p.resolve();
      const start = Date.now();
      await expect(p).resolves.toBe(undefined);
      expect(Date.now() - start).toBeLessThan(150);
    });
  });
});
