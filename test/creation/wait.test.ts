import { expect, test } from 'vitest';

import { wait } from '../../src/creation';
import { CancellablePromise } from '../../src/classes';

test(`returns CancellablePromise`, () => {
  const p = wait(0);
  expect(p).toBeInstanceOf(CancellablePromise);
});
test(`succeeds w/ number arg`, async () => {
  const p = wait(200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`succeeds w/ null arg`, async () => {
  let value = false;
  wait(null).then(() => (value = true));
  await Promise.resolve();
  expect(value).toBe(true);
});
test(`succeeds w/ options args`, async () => {
  const p = wait({ delay: 200 });
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
test(`resolves on cancel`, async () => {
  const p = wait(200);
  p.cancel();
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeLessThan(200);
});
test(`resolves on signal abort`, async () => {
  const controller = new AbortController();
  const p = wait({ delay: 200, abortSignal: controller.signal });
  controller.abort();
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeLessThan(200);
});
