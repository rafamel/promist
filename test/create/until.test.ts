import { until } from '~/create';

test(`unsafe resolves`, async () => {
  let val = false;
  const p = until(() => val);

  setTimeout(() => (val = true), 200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`unsafe rejects on sync throw`, async () => {
  const p = until(() => {
    throw Error(`foo`);
  });
  await expect(p).rejects.toThrowError('foo');
});
test(`unsafe rejects on promise rejection`, async () => {
  const p = until(() => Promise.reject(Error('foo')));
  await expect(p).rejects.toThrowError('foo');
});
test(`safe takes throws as false`, async () => {
  let val = false;
  const p = until(() => {
    if (!val) throw Error(`foo`);
    return true;
  }, true);

  setTimeout(() => (val = true), 200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`safe takes rejections as false`, async () => {
  let val = false;
  const p = until(() => val || Promise.reject(Error(`foo`)), true);

  setTimeout(() => (val = true), 200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
