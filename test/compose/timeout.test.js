import timeout from '~/compose/timeout';

test(`cancels on timeout wo/ reason`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100)(p);

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});

test(`rejects on timeout w/ reason`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100, 20)(p);

  await expect(p).rejects.toBe(20);
});

test(`resolves before timeout`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 100));
  timeout(200, 20)(p);

  await expect(p).resolves.toBe(10);
});

test(`rejects before timeout`, async () => {
  expect.assertions(1);
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = new Promise((resolve, reject) => setTimeout(() => reject(10), 100));
  timeout(200, 20)(p);

  await expect(p).rejects.toBe(10);
});
