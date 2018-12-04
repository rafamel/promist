import waitUntil from '~/create/wait-until';

test(`waits until truthy & resolves on value`, async () => {
  expect.assertions(3);
  const init = Date.now();
  let res = false;
  const p = waitUntil(() => res);
  setTimeout(() => (res = 10), 100);

  await expect(p).resolves.toBe(10);
  expect(Date.now() - init).toBeLessThan(130);
  expect(Date.now() - init).toBeGreaterThanOrEqual(100);
});

test(`waits takes into account ms`, async () => {
  expect.assertions(3);

  const init = Date.now();
  let res = false;
  const p1 = waitUntil(() => res, 3);
  const p2 = waitUntil(() => res, 200);
  setTimeout(() => (res = true), 100);

  await p1;
  expect(Date.now() - init).toBeLessThan(110);
  expect(Date.now() - init).toBeGreaterThanOrEqual(100);
  await p2;
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
});
