import lazy from '~/create/lazy';

describe(`lazy`, () => {
  test(`Executor is not run until then is called`, () => {
    let run = false;
    const p = lazy((resolve) => (run = true) && resolve());

    expect(run).toBe(false);
    p.then();
    expect(run).toBe(true);
  });
  test(`Executor is not run until catch is called`, () => {
    let run = false;
    const p = lazy((resolve) => (run = true) && resolve());

    expect(run).toBe(false);
    p.catch();
    expect(run).toBe(true);
  });
  test(`Resolves`, async () => {
    const p = lazy((resolve) => resolve(1));
    await expect(p).resolves.toBe(1);
  });
  test(`Rejects`, async () => {
    // @ts-ignore
    const p = lazy((_, reject) => reject(1));
    await expect(p).rejects.toBe(1);
  });
  test(`Executor doesn't run twice`, async () => {
    let run = 0;
    const p = lazy((resolve) => {
      run++;
      resolve(1);
    });

    expect(run).toBe(0);
    p.then();
    expect(run).toBe(1);
    await expect(p).resolves.toBe(1);
    expect(run).toBe(1);
    p.then();
    expect(run).toBe(1);
  });
});

describe(`lazy.fn`, () => {
  test(`doesn't run until then is called`, async () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve(10));
    const promise = lazy.fn(fn);
    expect(fn).not.toHaveBeenCalled();

    promise.then();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`doesn't run until catch is called`, async () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve(10));
    const promise = lazy.fn(fn);
    expect(fn).not.toHaveBeenCalled();

    promise.catch();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`doesn't run twice`, async () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve(10));
    const promise = lazy.fn(fn);
    expect(fn).not.toHaveBeenCalled();

    await promise;
    await promise;
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test(`resolves`, async () => {
    const fn1 = jest.fn().mockImplementation(() => Promise.resolve(10));
    const fn2 = jest.fn().mockImplementation(() => 10);
    const promise1 = lazy.fn(fn1);
    const promise2 = lazy.fn(fn2);

    await expect(promise1).resolves.toBe(10);
    await expect(promise2).resolves.toBe(10);
  });
  test(`rejects`, async () => {
    const fn1 = jest
      .fn()
      .mockImplementation(() => Promise.reject(Error('Foo')));
    const fn2 = jest.fn().mockImplementation(() => {
      throw Error('Foo');
    });
    const promise1 = lazy.fn(fn1);
    const promise2 = lazy.fn(fn2);

    await expect(promise1).rejects.toThrowErrorMatchingInlineSnapshot(`"Foo"`);
    await expect(promise2).rejects.toThrowErrorMatchingInlineSnapshot(`"Foo"`);
  });
});
