import { cancellable } from '~/extend';
import extend from '~/extend/cancellable';
import mark from '~/helpers/mark';

test(`named export returns a new promise`, async () => {
  const p = Promise.resolve('foo');
  const n = cancellable(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe('foo');
  expect(mark.get(n, 'cancellable')).toBe(true);
});
test(`default export returns a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = extend(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe('foo');
  expect(mark.get(m, 'cancellable')).toBe(true);
});
test(`should have cancel/cancelled`, async () => {
  const p = cancellable(Promise.resolve());

  expect(typeof p.cancel).toBe('function');
  expect(p.cancelled).toBe(false);
});
test(`should resolve`, async () => {
  const p = cancellable(
    new Promise((resolve) => setTimeout(() => resolve(10), 250))
  );

  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should reject`, async () => {
  const p = cancellable(
    new Promise((resolve, reject) =>
      setTimeout(() => reject(Error('Foo')), 250)
    )
  );

  await expect(p).rejects.toThrowError('Foo');
  expect(p.cancelled).toBe(false);
});
test(`should cancel`, async () => {
  const p = cancellable(
    new Promise((resolve) => setTimeout(() => resolve(10), 250))
  );
  let res;
  p.then((x) => (res = x));
  p.cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(res).toBe(undefined);
  expect(p.cancelled).toBe(true);
});
test(`should cancel (2)`, async () => {
  const p = cancellable(
    new Promise((resolve, reject) =>
      setTimeout(() => reject(Error('Foo')), 250)
    )
  );
  let res;
  p.catch((x) => (res = x));
  p.cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(res).toBe(undefined);
  expect(p.cancelled).toBe(true);
});
test(`should fail silently`, async () => {
  const p = cancellable(Promise.resolve(10));
  await p;

  expect(() => p.cancel()).not.toThrow();
  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should not run twice for a cancellable promise`, () => {
  const p = cancellable(Promise.resolve());
  const _cancel = p.cancel;
  cancellable(p);

  expect(p.cancel).toBe(_cancel);
});
