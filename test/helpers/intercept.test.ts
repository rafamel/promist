import intercept from '~/helpers/intercept';

describe(`then`, () => {
  test(`intercepts then`, async () => {
    const p = Promise.resolve(10);
    intercept(p, (p) => p.then((x) => x * 2));

    await expect(p).resolves.toBe(20);
  });
  test(`Intercepts for inner async fns`, async () => {
    const p = Promise.resolve(10);
    intercept(p, (p) => p.then(async (x) => x * 2));

    await expect(p).resolves.toBe(20);
  });
});

describe(`catch`, () => {
  test(`intercepts catch`, async () => {
    const p = Promise.reject(Error('Foo'));
    intercept(p, (p: Promise<any>) => {
      return p
        .then(() => 20)
        .catch((x) =>
          Promise.reject(
            Error(
              Object.hasOwnProperty.call(x, 'message') && x.message === 'Foo'
                ? 'Bar'
                : 'Baz'
            )
          )
        );
    });

    await expect(p).rejects.toThrowError('Bar');
  });
  test(`intercepts for inner async fns`, async () => {
    const p = Promise.reject(Error('Foo'));
    intercept(p, (p: Promise<any>) => {
      return p
        .then(() => 20)
        .catch(async (x) => {
          throw Error(
            Object.hasOwnProperty.call(x, 'message') && x.message === 'Foo'
              ? 'Bar'
              : 'Baz'
          );
        });
    });

    await expect(p).rejects.toThrowError('Bar');
  });
});

describe(`general`, () => {
  test(`returns promise`, () => {
    const p = Promise.resolve(10);
    const p2 = intercept(p, (p) => p.then((x) => x * 2));

    expect(p2).toBe(p);
  });
  test(`Allows for several interceptions & executes in order`, async () => {
    const p = Promise.resolve(10);
    intercept(p, (p) => p.then(async (x) => x / 2));
    intercept(p, (p) => p.then((x) => x / 5));
    intercept(p, (p) => p.then(async (x) => x * 6));
    intercept(p, (p) => p.then((x) => x / 3));

    await expect(p).resolves.toBe(2);
  });
  test(`only executes the whole flow once`, async () => {
    const p = Promise.resolve(10);
    let count = 0;
    intercept(p, (p) =>
      p.then((x) => {
        count++;
        return x;
      })
    );

    await p;
    expect(count).toBe(1);
    await p;
    expect(count).toBe(1);
  });
  test(`executes the whole flow again when an intercept is added`, async () => {
    const p = Promise.resolve(10);
    let count = 0;
    intercept(p, (p) =>
      p.then((x) => {
        count++;
        return x;
      })
    );

    await p;
    expect(count).toBe(1);

    intercept(p, (p) => p);
    await p;
    expect(count).toBe(2);
  });
});
