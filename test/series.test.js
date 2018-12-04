import series from '~/series';
import lazy from '~/create/lazy';

const createArr = (arr = [1, 2, 3, 4]) => arr.map((x) => Promise.resolve(x));
const createDelayedArr = (n = 50, ms = 1) => {
  return Array(50)
    .fill(0)
    .map((_, i) => {
      return lazy((resolve) => setTimeout(() => resolve(i), ms * (n - i)));
    });
};

describe(`map`, () => {
  test(`maps`, async () => {
    expect.assertions(1);

    const p = series.map(createArr(), (x) => x + 1);
    await expect(p).resolves.toEqual([2, 3, 4, 5]);
  });
  test(`maps for async inner fn`, async () => {
    expect.assertions(1);

    const p = series.map(createArr(), async (x) => x + 1);
    await expect(p).resolves.toEqual([2, 3, 4, 5]);
  });
  test(`receives all args`, async () => {
    expect.assertions(9);

    const pArr = createArr();
    const p = series.map(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual(pArr);
      return x;
    });
    await expect(p).resolves.toEqual([1, 2, 3, 4]);
  });
  test(`runs in series`, async () => {
    expect.assertions(2);

    const arr = createDelayedArr();
    const init = Date.now();
    const p = series.map(arr, async (x) => x + 1);
    await expect(p).resolves.toEqual(arr.map((_, i) => i + 1));
    expect(Date.now() - init).toBeGreaterThan(1200);
  });
});

describe(`filter`, () => {
  test(`filters`, async () => {
    expect.assertions(1);

    const p = series.filter(createArr(), (x) => x % 2 === 0);
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`filters for async inner fn`, async () => {
    expect.assertions(1);

    const p = series.filter(createArr(), async (x) => x % 2 === 0);
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`receives all args`, async () => {
    expect.assertions(9);

    const pArr = createArr();
    const p = series.filter(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual(pArr);
      return x % 2 === 0;
    });
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`runs in series`, async () => {
    expect.assertions(2);

    const arr = createDelayedArr();
    const init = Date.now();
    const p = series.filter(arr, async (x) => x % 2 === 0);
    await expect(p).resolves.toEqual(
      arr.map((_, i) => i).filter((x) => x % 2 === 0)
    );
    expect(Date.now() - init).toBeGreaterThan(1200);
  });
});

describe(`reduce`, () => {
  test(`reduces`, async () => {
    expect.assertions(1);

    const p = series.reduce(createArr(), (acc, x) => acc + x);
    await expect(p).resolves.toEqual(10);
  });
  test(`reduces w/ initialValue`, async () => {
    expect.assertions(1);

    const p = series.reduce(createArr(), (acc, x) => acc + x, 4);
    await expect(p).resolves.toEqual(14);
  });
  test(`reduces w/ initialValue as Promise`, async () => {
    expect.assertions(1);

    const p = series.reduce(
      createArr(),
      (acc, x) => acc + x,
      Promise.resolve(4)
    );
    await expect(p).resolves.toEqual(14);
  });
  test(`reduces for async inner fn`, async () => {
    expect.assertions(1);

    const p = series.reduce(createArr(), async (acc, x) => x + acc);
    await expect(p).resolves.toEqual(10);
  });
  test(`receives all args`, async () => {
    expect.assertions(13);

    const pArr = createArr();
    const p = series.reduce(
      pArr,
      (acc, x, i, arr) => {
        expect(x).toBe(i + 1);
        expect(arr).toEqual(pArr);
        expect(acc).toBe(
          Array(i + 1)
            .fill(0)
            .map((_, i) => i)
            .reduce((acc, x) => acc + x)
        );
        return acc + x;
      },
      0
    );
    await expect(p).resolves.toEqual(10);
  });
  test(`runs in series`, async () => {
    expect.assertions(2);

    const arr = createDelayedArr();
    const init = Date.now();
    const p = series.reduce(arr, async (acc, x) => acc + x);
    await expect(p).resolves.toEqual(
      arr.map((_, i) => i).reduce((acc, x) => acc + x)
    );
    expect(Date.now() - init).toBeGreaterThan(1200);
  });
});

describe(`each`, () => {
  test(`runs for each`, async () => {
    expect.assertions(2);

    const resArr = [];
    const p = series.each(createArr(), (x) => {
      resArr.push(x);
      return x;
    });

    await expect(p).resolves.toBe(undefined);
    expect(resArr).toEqual([1, 2, 3, 4]);
  });
  test(`run on each for async inner fn`, async () => {
    expect.assertions(6);

    let isDone = false;
    const resArr = [];
    const p = series.each(createArr(), async (x) => {
      expect(isDone).toBe(false);
      resArr.push(x);
      return x;
    });

    await expect(p).resolves.toBe(undefined);
    expect(resArr).toEqual([1, 2, 3, 4]);
    isDone = true;
  });
  test(`receives all args`, async () => {
    expect.assertions(10);

    const resArr = [];
    const pArr = createArr();
    const p = series.each(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual(pArr);
      resArr.push(x);
      return x;
    });

    await expect(p).resolves.toBe(undefined);
    expect(resArr).toEqual([1, 2, 3, 4]);
  });
  test(`runs in series`, async () => {
    expect.assertions(1);

    const arr = createDelayedArr();
    const init = Date.now();
    const p = series.each(arr, async () => {});

    await p;
    expect(Date.now() - init).toBeGreaterThan(1200);
  });
});
