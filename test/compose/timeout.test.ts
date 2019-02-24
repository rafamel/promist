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

test(`cancels on timeout w/ reason "false"`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100, false)(p);

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});

test(`rejects on timeout w/ reason`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  // @ts-ignore
  timeout(100, 20)(p);

  await expect(p).rejects.toBe(20);
});

test(`rejects on timeout w/ reason for falsy value`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  // @ts-ignore
  timeout(100, 0)(p);

  await expect(p).rejects.toBe(0);
});

test(`rejects on timeout w/ reason as boolean`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100, true)(p);

  await expect(p).rejects.toThrowError('Promise timed out');
});

test(`resolves before timeout`, async () => {
  expect.assertions(1);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 100));
  // @ts-ignore
  timeout(200, 20)(p);

  await expect(p).resolves.toBe(10);
});

test(`rejects before timeout`, async () => {
  expect.assertions(1);
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = new Promise((resolve, reject) => setTimeout(() => reject(10), 100));
  // @ts-ignore
  timeout(200, 20)(p);

  await expect(p).rejects.toBe(10);
});
