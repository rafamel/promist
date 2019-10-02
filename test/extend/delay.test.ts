import { delay } from '~/extend';
import extend from '~/extend/delay';

test(`delays when it's resolved; named export returns a new promise`, async () => {
  const p = Promise.resolve(10);
  const init = Date.now();
  const n = delay(200)(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);
});
test(`delays when it's resolved; default export returns a mutated promise`, async () => {
  const init = Date.now();
  const p = Promise.resolve(10);
  const m = extend(200)(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);
});
test(`doesn't delay further when it's not resolved`, async () => {
  const init = Date.now();
  const p = delay(200)(
    new Promise((resolve) => setTimeout(() => resolve(10), 200))
  );

  await expect(p).resolves.toBe(10);
  expect(Date.now() - init).toBeGreaterThan(200);
  expect(Date.now() - init).toBeLessThan(400);
});
test(`doesn't delay rejections`, async () => {
  const init = Date.now();
  const p = delay(200)(Promise.reject(Error('Foo')));

  await expect(p).rejects.toThrowError('Foo');
  expect(Date.now() - init).toBeLessThan(200);
});
test(`delays rejections`, async () => {
  const init = Date.now();
  const p = delay(200, true)(Promise.reject(Error('Foo')));

  await expect(p).rejects.toThrowError('Foo');
  expect(Date.now() - init).toBeGreaterThanOrEqual(200);
  expect(Date.now() - init).toBeLessThan(400);
});
