import { timeout } from '~/extend';
import extend from '~/extend/timeout';
import mark from '~/helpers/mark';

test(`named export returns a new promise`, async () => {
  const p = Promise.resolve('foo');
  const n = timeout(100)(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe('foo');
  expect(mark.get(n, 'cancellable')).toBe(true);
  expect(mark.get(n, 'deferrable')).toBe(true);
});
test(`default export returns a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = extend(100)(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe('foo');
  expect(mark.get(m, 'cancellable')).toBe(true);
  expect(mark.get(m, 'deferrable')).toBe(true);
});
test(`cancels on timeout wo/ reason`, async () => {
  const p = timeout(100)(
    new Promise((resolve) => setTimeout(() => resolve(10), 200))
  );

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});
test(`cancels on timeout w/ reason "false"`, async () => {
  const p = timeout(100, false)(
    new Promise((resolve) => setTimeout(() => resolve(10), 200))
  );

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});
test(`rejects on timeout w/ reason`, async () => {
  const p = timeout(100, Error('Foo'))(
    new Promise((resolve) => setTimeout(() => resolve(10), 200))
  );

  await expect(p).rejects.toThrowError('Foo');
});
test(`rejects on timeout w/ reason as boolean`, async () => {
  const p = timeout(100, true)(
    new Promise((resolve) => setTimeout(() => resolve(10), 200))
  );

  await expect(p).rejects.toThrowError('Promise timed out');
});
test(`resolves before timeout`, async () => {
  const p = timeout(200, Error('foo'))(
    new Promise((resolve) => setTimeout(() => resolve(10), 100))
  );

  await expect(p).resolves.toBe(10);
});
test(`rejects before timeout`, async () => {
  const p = timeout(200, Error('Bar'))(
    new Promise((resolve, reject) =>
      setTimeout(() => reject(Error('Foo')), 100)
    )
  );

  await expect(p).rejects.toThrowError('Foo');
});
