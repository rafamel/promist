import waitUntil from '~/create/wait-until';

test(`waits until truthy & resolves on value`, async () => {
  const init = Date.now();
  let res: boolean | number = false;
  const p = waitUntil(() => Boolean(res));
  setTimeout(() => (res = 10), 100);

  await expect(p).resolves.toBe(undefined);
  expect(Date.now() - init).toBeLessThan(250);
  expect(Date.now() - init).toBeGreaterThanOrEqual(100);
});
test(`waits takes into account ms`, async () => {
  let res = false;
  const init = Date.now();
  const p1 = waitUntil(() => res, 20);
  const p2 = waitUntil(() => res, 300);
  setTimeout(() => (res = true), 100);

  await p1;
  expect(Date.now() - init).toBeLessThan(200);
  expect(Date.now() - init).toBeGreaterThanOrEqual(100);
  await p2;
  expect(Date.now() - init).toBeGreaterThanOrEqual(250);
});
test(`rejects on test callback error`, async () => {
  await expect(
    waitUntil(() => {
      throw Error('Foo');
    })
  ).rejects.toThrowError('Foo');
  await expect(
    waitUntil(() => Promise.reject(Error('Foo')))
  ).rejects.toThrowError('Foo');
});
