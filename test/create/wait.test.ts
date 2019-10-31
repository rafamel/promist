import { wait } from '~/create';

test(`waits`, async () => {
  const p = wait(200);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(200);
  expect(Date.now() - start).toBeLessThan(400);
});
