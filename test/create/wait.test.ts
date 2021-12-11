import { test, expect } from '@jest/globals';
import { wait } from '../../src/create';

test(`waits`, async () => {
  const p = wait(200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
