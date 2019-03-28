import mark from '~/helpers/mark';
import deferrable from '~/compose/deferrable';
import { IDeferrable } from '~/types';

test(`returns new/mutated deferrable promise`, async () => {
  expect.assertions(6);
  const p = Promise.resolve('foo');

  const m = deferrable(p);
  const n = deferrable(p, true);
  expect(m).toBe(p);
  expect(n).not.toBe(p);
  expect(mark.get(m, 'deferrable')).toBe(true);
  expect(mark.get(n, 'deferrable')).toBe(true);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
});
test(`Should have resolve/reject`, () => {
  expect.assertions(2);
  const p: IDeferrable & Promise<any> = Promise.resolve() as any;
  deferrable(p);

  expect(typeof p.resolve).toBe('function');
  expect(typeof p.reject).toBe('function');
});
test(`Should resolve w/ origin promise`, async () => {
  expect.assertions(1);
  const p: IDeferrable & Promise<any> = new Promise((resolve) =>
    setTimeout(() => resolve(10), 250)
  ) as any;
  deferrable(p);
  setTimeout(() => p.resolve(20), 350);

  await expect(p).resolves.toBe(10);
});
test(`Should reject w/ origin promise`, async () => {
  expect.assertions(1);
  const p: IDeferrable & Promise<any> = new Promise((resolve, reject) =>
    // eslint-disable-next-line prefer-promise-reject-errors
    setTimeout(() => reject(10), 250)
  ) as any;
  deferrable(p);
  // @ts-ignore
  setTimeout(() => p.reject(20), 350);

  await expect(p).rejects.toBe(10);
});
test(`Should resolve with promise.resolve()`, async () => {
  expect.assertions(1);
  const p: IDeferrable & Promise<any> = new Promise((resolve) =>
    setTimeout(() => resolve(10), 250)
  ) as any;
  deferrable(p);
  p.resolve(20);

  await expect(p).resolves.toBe(20);
});
test(`Should reject with promise.reject()`, async () => {
  expect.assertions(1);
  const p: IDeferrable & Promise<any> = new Promise((resolve) =>
    setTimeout(() => resolve(10), 250)
  ) as any;
  deferrable(p);
  // @ts-ignore
  p.reject(20);

  await expect(p).rejects.toBe(20);
});
test(`should not run twice for a deferrable promise`, () => {
  const p: IDeferrable & Promise<any> = Promise.resolve() as any;
  deferrable(p);
  const [_resolve, _reject] = [p.resolve, p.reject];
  deferrable(p);

  expect(p.resolve).toBe(_resolve);
  expect(p.reject).toBe(_reject);
});
