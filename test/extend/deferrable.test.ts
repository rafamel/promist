import { deferrable } from '~/extend';
import extend from '~/extend/deferrable';
import mark from '~/helpers/mark';

test(`named export returns a new promise`, async () => {
  const p = Promise.resolve('foo');
  const n = deferrable(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe('foo');
  expect(mark.get(n, 'deferrable')).toBe(true);
});
test(`default export returns a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = extend(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe('foo');
  expect(mark.get(m, 'deferrable')).toBe(true);
});
test(`Should have resolve/reject`, () => {
  const p = deferrable(Promise.resolve());

  expect(typeof p.resolve).toBe('function');
  expect(typeof p.reject).toBe('function');
});
test(`should resolve w/ origin promise`, async () => {
  const p = deferrable(
    new Promise((resolve) => setTimeout(() => resolve(10), 250))
  );
  setTimeout(() => p.resolve(20), 350);

  await expect(p).resolves.toBe(10);
});
test(`should reject w/ origin promise`, async () => {
  const p = deferrable(
    new Promise((resolve, reject) =>
      setTimeout(() => reject(Error('Foo')), 250)
    )
  );
  setTimeout(() => p.reject(Error('Bar')), 350);

  await expect(p).rejects.toThrowError('Foo');
});
test(`should resolve with promise.resolve()`, async () => {
  const p = deferrable(
    new Promise((resolve) => setTimeout(() => resolve(10), 250))
  );
  p.resolve(20);

  await expect(p).resolves.toBe(20);
});
test(`should reject with promise.reject()`, async () => {
  const p = deferrable(
    new Promise((resolve) => setTimeout(() => resolve(10), 250))
  );
  p.reject(Error('Foo'));

  await expect(p).rejects.toThrowError('Foo');
});
test(`should not run twice for a deferrable promise`, () => {
  const p = deferrable(Promise.resolve());
  const [_resolve, _reject] = [p.resolve, p.reject];
  deferrable(p);

  expect(p.resolve).toBe(_resolve);
  expect(p.reject).toBe(_reject);
});
