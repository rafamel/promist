import { wait } from '~/create';

test(`waits`, async () => {
  const p = wait(250);
  const start = Date.now();
  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - start).toBeGreaterThanOrEqual(250);
  expect(Date.now() - start).toBeLessThan(350);
});
