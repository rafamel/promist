import intercept from '~/helpers/intercept';

describe(`then`, () => {
  test(`Intercepts then`, async () => {
    expect.assertions(1);

    const p = Promise.resolve(10);
    intercept(p, (p) => p.then((x) => x * 2));

    await expect(p).resolves.toBe(20);
  });

  test(`Intercepts for inner async fns`, async () => {
    expect.assertions(1);

    const p = Promise.resolve(10);
    intercept(p, (p) => p.then(async (x) => x * 2));

    await expect(p).resolves.toBe(20);
  });
});

describe(`catch`, () => {
  test(`Intercepts catch`, async () => {
    expect.assertions(1);

    // eslint-disable-next-line prefer-promise-reject-errors
    const p = Promise.reject(10);
    intercept(p, (p) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return p.then((x) => x * 2).catch((x) => Promise.reject(x * 3));
    });

    await expect(p).rejects.toBe(30);
  });
  test(`Intercepts for inner async fns`, async () => {
    expect.assertions(1);

    // eslint-disable-next-line prefer-promise-reject-errors
    const p = Promise.reject(10);
    intercept(p, (p) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return p.then((x) => x * 2).catch(async (x) => Promise.reject(x * 3));
    });

    await expect(p).rejects.toBe(30);
  });
});

describe(`general`, () => {
  test(`Returns p`, () => {
    expect.assertions(1);

    const p = Promise.resolve(10);
    const p2 = intercept(p, (p) => p.then((x) => x * 2));

    expect(p2).toBe(p);
  });
  test(`Allows for several interceptions & executes in order`, async () => {
    expect.assertions(1);

    const p = Promise.resolve(10);
    intercept(p, (p) => p.then(async (x) => x / 2));
    intercept(p, (p) => p.then((x) => x / 5));
    intercept(p, (p) => p.then(async (x) => x * 6));
    intercept(p, (p) => p.then((x) => x / 3));

    await expect(p).resolves.toBe(2);
  });
});
