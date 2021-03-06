import parallel from '~/collections/parallel';
import { LazyPromist } from '~/classes';

const createArr = (arr: number[] = [1, 2, 3, 4]): Array<Promise<number>> => {
  return arr.map((x) => Promise.resolve(x));
};
const createDelayedArr = (
  n: number = 50,
  ms: number = 1
): Array<Promise<number>> => {
  return Array(50)
    .fill(0)
    .map((_, i) => {
      return new LazyPromist((resolve) => {
        setTimeout(() => resolve(i), ms * (n - i));
      });
    });
};

describe(`map`, () => {
  test(`maps`, async () => {
    const p = parallel.map(createArr(), (x) => x + 1);
    await expect(p).resolves.toEqual([2, 3, 4, 5]);
  });
  test(`maps for async inner fn`, async () => {
    const p = parallel.map(createArr(), async (x) => x + 1);
    await expect(p).resolves.toEqual([2, 3, 4, 5]);
  });
  test(`receives all args`, async () => {
    expect.assertions(9);

    const pArr = createArr();
    const p = parallel.map(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual([1, 2, 3, 4]);
      return x;
    });
    await expect(p).resolves.toEqual([1, 2, 3, 4]);
  });
  test(`runs in parallel`, async () => {
    const arr = createDelayedArr();
    const init = Date.now();
    const p = parallel.map(arr, async (x) => x + 1);
    await expect(p).resolves.toEqual(arr.map((_, i) => i + 1));
    expect(Date.now() - init).toBeLessThan(150);
  });
});

describe(`filter`, () => {
  test(`filters`, async () => {
    const p = parallel.filter(createArr(), (x) => x % 2 === 0);
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`filters for async inner fn`, async () => {
    const p = parallel.filter(createArr(), async (x) => x % 2 === 0);
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`receives all args`, async () => {
    expect.assertions(9);

    const pArr = createArr();
    const p = parallel.filter(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual([1, 2, 3, 4]);
      return x % 2 === 0;
    });
    await expect(p).resolves.toEqual([2, 4]);
  });
  test(`runs in parallel`, async () => {
    const arr = createDelayedArr();
    const init = Date.now();
    const p = parallel.filter(arr, async (x) => x % 2 === 0);
    await expect(p).resolves.toEqual(
      arr.map((_, i) => i).filter((x) => x % 2 === 0)
    );
    expect(Date.now() - init).toBeLessThan(150);
  });
});

describe(`reduce`, () => {
  test(`reduces`, async () => {
    const p = parallel.reduce(createArr(), async (acc, x) => (await acc) + x);
    await expect(p).resolves.toEqual(10);
  });
  test(`reduces w/ initialValue`, async () => {
    expect.assertions(1);

    const p = parallel.reduce(
      createArr(),
      async (acc, x) => (await acc) + x,
      4
    );
    await expect(p).resolves.toEqual(14);
  });
  test(`reduces w/ initialValue as Promise`, async () => {
    const p = parallel.reduce(
      createArr(),
      async (acc, x) => (await acc) + x,
      Promise.resolve(4)
    );
    await expect(p).resolves.toEqual(14);
  });
  test(`reduces for async inner fn`, async () => {
    const p = parallel.reduce(createArr(), async (acc, x) => (await acc) + x);
    await expect(p).resolves.toEqual(10);
  });
  test(`receives all args`, async () => {
    expect.assertions(13);

    const pArr = createArr();
    const p = parallel.reduce(
      pArr,
      async (acc, x, i, arr) => {
        expect(x).toBe(i + 1);
        expect(arr).toEqual([1, 2, 3, 4]);
        const resAcc = await acc;
        expect(resAcc).toBe(
          Array(i + 1)
            .fill(0)
            .map((_, i) => i)
            .reduce((acc, x) => acc + x)
        );
        return resAcc + x;
      },
      0
    );
    await expect(p).resolves.toEqual(10);
  });
  test(`runs in parallel`, async () => {
    const arr = createDelayedArr();
    const init = Date.now();
    const p = parallel.reduce(arr, async (acc, x) => (await acc) + x);
    await expect(p).resolves.toEqual(
      arr.map((_, i) => i).reduce((acc, x) => acc + x)
    );
    expect(Date.now() - init).toBeLessThan(150);
  });
});

describe(`each`, () => {
  test(`runs for each`, async () => {
    const resArr: any[] = [];
    const p = parallel.each(createArr(), (x) => {
      resArr.push(x);
      return x;
    });

    await expect(p).resolves.toBe(undefined);
    expect(resArr).toEqual([1, 2, 3, 4]);
  });
  test(`run on each for async inner fn`, async () => {
    expect.assertions(6);

    let isDone = false;
    const resArr: any[] = [];
    const p = parallel.each(createArr(), async (x) => {
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

    const resArr: any[] = [];
    const pArr = createArr();
    const p = parallel.each(pArr, (x, i, arr) => {
      expect(x).toBe(i + 1);
      expect(arr).toEqual([1, 2, 3, 4]);
      resArr.push(x);
      return x;
    });

    await expect(p).resolves.toBe(undefined);
    expect(resArr).toEqual([1, 2, 3, 4]);
  });
  test(`runs in parallel`, async () => {
    const arr = createDelayedArr();
    const init = Date.now();
    const p = parallel.each(arr, async () => undefined);

    await p;
    expect(Date.now() - init).toBeLessThan(150);
  });
});
