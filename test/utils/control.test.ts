import control from '~/utils/control';

test(`succeeds with test => true`, async () => {
  function* gen(): Generator<number, number, number> {
    return 1;
  }
  const fn = control(() => true, gen);
  const fnp = control(() => Promise.resolve(true), gen);

  await expect(fn()).resolves.toBe(1);
  await expect(fnp()).resolves.toBe(1);
});
test(`doesn't resolve with test => false`, async () => {
  function* gen(): Generator<number, number, number> {
    return 1;
  }
  const fn = control(() => false, gen);
  const fnp = control(() => Promise.resolve(false), gen);

  const res = [false, false];
  fn().then(() => (res[0] = true));
  fnp().then(() => (res[1] = true));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(res).toEqual([false, false]);
});
test(`rejects with test => Error`, async () => {
  function* gen(): Generator<number, number, number> {
    return 1;
  }
  const fn = control(() => Error(), gen);
  const fnp = control(() => Promise.resolve(Error()), gen);

  await expect(fn()).rejects.toThrowError();
  await expect(fnp()).rejects.toThrowError();
});
test(`rejects with test throwing Error`, async () => {
  function* gen(): Generator<number, number, number> {
    return 1;
  }
  const fn = control(() => {
    throw Error();
  }, gen);
  const fnp = control(() => Promise.reject(Error()), gen);

  await expect(fn()).rejects.toThrowError();
  await expect(fnp()).rejects.toThrowError();
});
test(`rejects with generator throwing Error`, async () => {
  const fn = control(() => true, function*(): Generator<any, any, any> {
    throw Error();
  });

  await expect(fn()).rejects.toThrowError();
});
test(`yields and succeeds with test => true`, async () => {
  function* gen(
    n = 10
  ): Generator<Promise<number> | number, Promise<number> | number, number> {
    n = yield Promise.resolve(n);
    n = n * (yield Promise.resolve(10));
    n = yield 10 * n;

    return n * 10;
  }
  const fn = control(() => true, gen);
  const fnp = control(() => Promise.resolve(true), gen);

  await expect(fn()).resolves.toBe(10000);
  await expect(fnp()).resolves.toBe(10000);
});
test(`test is called as many times as yields are + 1`, async () => {
  let count = 0;
  const fn = control(
    () => {
      count++;
      return true;
    },
    function*(n = 10) {
      n = yield Promise.resolve(n);
      n = n * (yield Promise.resolve(10));
      n = yield 10 * n;

      return n * 10;
    }
  );

  await fn();
  expect(count).toBe(4);
});
test(`stops yielding on test => false`, async () => {
  let res = true;
  const done = [false, false, false, false, false];
  setTimeout(() => (res = false), 500);
  const fn = control(() => res, function*(): Generator<any, any, any> {
    done[0] = true;
    yield Promise.resolve();
    done[1] = true;
    yield new Promise((resolve) => setTimeout(resolve, 250));
    done[2] = true;
    yield new Promise((resolve) => setTimeout(resolve, 300));
    done[3] = true;
    yield new Promise((resolve) => setTimeout(resolve, 100));
    done[4] = true;
  });

  let resolved = false;
  fn().then(() => (resolved = true));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(resolved).toBe(false);
  expect(done).toEqual([true, true, true, true, false]);
});
test(`passes arguments to generator`, async () => {
  const fn = control(() => true, function*(
    a,
    b,
    c,
    d
  ): Generator<any, any, any> {
    return [a, b, c, d];
  });

  await expect(fn(1, 2, 3, 4)).resolves.toEqual([1, 2, 3, 4]);
});
