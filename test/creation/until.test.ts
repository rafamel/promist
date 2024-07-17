import { expect, test } from 'vitest';

import { CancellablePromise } from '../../src/classes';
import { until } from '../../src/creation';

test(`returns CancellablePromise`, () => {
  const p = until(0, () => true);
  expect(p).toBeInstanceOf(CancellablePromise);
});
test(`resolves once test returns true`, async () => {
  let val = false;
  const p = until(0, () => val);

  const start = Date.now();
  setTimeout(() => (val = true), 250);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`resolves once test resolves true`, async () => {
  let val = false;
  const p = until(0, () => Promise.resolve(val));

  const start = Date.now();
  setTimeout(() => (val = true), 250);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`treats error as false w/ ignoreError`, async () => {
  let val = false;
  const p = until({ delay: 0, ignoreError: true }, () => {
    if (val) return true;
    else throw new Error('...');
  });

  const start = Date.now();
  setTimeout(() => (val = true), 250);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`treats rejection as false w/ ignoreError`, async () => {
  let val = false;
  const p = until({ delay: 0, ignoreError: true }, () => {
    return val ? Promise.resolve(val) : Promise.reject(new Error('...'));
  });

  const start = Date.now();
  setTimeout(() => (val = true), 250);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`rejects on test error`, async () => {
  const p = until(0, () => {
    throw new Error('foo');
  });
  await expect(p).rejects.toThrowError('foo');
});
test(`rejects on test rejection`, async () => {
  const p = until(0, () => Promise.reject(new Error(`foo`)));
  await expect(p).rejects.toThrowError('foo');
});
test(`uses delay value`, async () => {
  let val = false;
  const p = until(500, () => val);

  const start = Date.now();
  setTimeout(() => (val = true), 200);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(450);
  expect(Date.now() - start).toBeLessThan(750);
});
test(`resolves early on cancel`, async () => {
  let val = false;
  const p = until(0, () => val);
  p.cancel();

  const start = Date.now();
  setTimeout(() => (val = true), 200);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeLessThan(150);
});
test(`resolves early on signal abort`, async () => {
  let val = false;
  const controller = new AbortController();
  const p = until({ delay: 0, abortSignal: controller.signal }, () => val);
  controller.abort();

  const start = Date.now();
  setTimeout(() => (val = true), 200);
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeLessThan(150);
});
