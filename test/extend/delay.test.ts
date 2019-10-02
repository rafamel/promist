import delay from '~/extend/delay';

test(`delays when it's resolved; returns new/mutated promise`, async () => {
  let init = Date.now();
  const p = Promise.resolve(10);
  const m = delay(200)(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);

  init = Date.now();
  const n = delay(200)(p, true);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);
});

test(`doesn't delay further when it's not resolved`, async () => {
  const init = Date.now();
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  delay(200)(p);

  await expect(p).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThan(200);
  expect(Date.now() - init).toBeLessThan(400);
});

test(`doesn't delay rejections`, async () => {
  const init = Date.now();
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = Promise.reject(10);
  delay(200)(p);

  await expect(p).rejects.toBe(10);
  expect(Date.now() - init).toBeLessThan(200);
});

test(`delays rejections`, async () => {
  const init = Date.now();
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = Promise.reject(10);
  delay(200, true)(p);

  await expect(p).rejects.toBe(10);
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);
});
