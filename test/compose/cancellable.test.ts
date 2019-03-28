import mark from '~/helpers/mark';
import cancellable from '~/compose/cancellable';
import { ICancellable } from '~/types';

test(`returns new/mutated cancellable promise`, async () => {
  expect.assertions(6);
  const p = Promise.resolve('foo');

  const m = cancellable(p);
  const n = cancellable(p, true);

  expect(m).toBe(p);
  expect(n).not.toBe(p);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
  expect(mark.get(m, 'cancellable')).toBe(true);
  expect(mark.get(n, 'cancellable')).toBe(true);
});
test(`should have cancel/cancelled`, async () => {
  expect.assertions(2);
  const p: ICancellable & Promise<any> = Promise.resolve() as any;
  cancellable(p);

  expect(typeof p.cancel).toBe('function');
  expect(p.cancelled).toBe(false);
});
test(`should resolve`, async () => {
  expect.assertions(2);
  const p: ICancellable & Promise<any> = new Promise((resolve) =>
    setTimeout(() => resolve(10), 250)
  ) as any;
  cancellable(p);

  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should reject`, async () => {
  expect.assertions(2);
  const p: ICancellable & Promise<any> = new Promise((resolve, reject) =>
    // eslint-disable-next-line prefer-promise-reject-errors
    setTimeout(() => reject(10), 250)
  ) as any;
  cancellable(p);

  await expect(p).rejects.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should cancel`, async () => {
  expect.assertions(2);
  const p: ICancellable & Promise<any> = new Promise((resolve) =>
    setTimeout(() => resolve(10), 250)
  ) as any;
  cancellable(p);
  let res;
  p.then((x) => (res = x));
  p.cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(res).toBe(undefined);
  expect(p.cancelled).toBe(true);
});
test(`should cancel (2)`, async () => {
  expect.assertions(2);
  const p: ICancellable & Promise<any> = new Promise((resolve, reject) =>
    // eslint-disable-next-line prefer-promise-reject-errors
    setTimeout(() => reject(10), 250)
  ) as any;
  cancellable(p);
  let res;
  p.catch((x) => (res = x));
  p.cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(res).toBe(undefined);
  expect(p.cancelled).toBe(true);
});
test(`should fail silently`, async () => {
  expect.assertions(3);
  const p: ICancellable & Promise<any> = Promise.resolve(10) as any;
  cancellable(p);
  await p;

  expect(() => p.cancel()).not.toThrow();
  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should not run twice for a cancellable promise`, () => {
  const p: ICancellable & Promise<any> = Promise.resolve() as any;
  cancellable(p);
  const _cancel = p.cancel;
  cancellable(p);

  expect(p.cancel).toBe(_cancel);
});
