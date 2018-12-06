import mark from '~/helpers/mark';
import cancellable from '~/compose/cancellable';

test(`should be marked as cancellable`, () => {
  const p = Promise.resolve();
  cancellable(p);

  expect(mark.get(p, 'cancellable')).toBe(true);
});
test(`should have cancel/cancelled`, async () => {
  expect.assertions(2);
  const p = Promise.resolve();
  cancellable(p);

  expect(typeof p.cancel).toBe('function');
  expect(p.cancelled).toBe(false);
});
test(`should resolve`, async () => {
  expect.assertions(2);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 250));
  cancellable(p);

  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should reject`, async () => {
  expect.assertions(2);
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = new Promise((resolve, reject) => setTimeout(() => reject(10), 250));
  cancellable(p);

  await expect(p).rejects.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should cancel`, async () => {
  expect.assertions(2);
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 250));
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
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = new Promise((resolve, reject) => setTimeout(() => reject(10), 250));
  cancellable(p);
  let res;
  p.catch((x) => (res = x));
  p.cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(res).toBe(undefined);
  expect(p.cancelled).toBe(true);
});
test(`should fail silently`, async () => {
  expect.assertions(2);
  const p = Promise.resolve(10);
  cancellable(p);
  await new Promise((resolve) =>
    setTimeout(() => {
      p.cancel();
      resolve();
    }, 100)
  );

  await expect(p).resolves.toBe(10);
  expect(p.cancelled).toBe(false);
});
test(`should not run twice for a cancellable promise`, () => {
  const p = Promise.resolve();
  cancellable(p);
  const _cancel = p.cancel;
  cancellable(p);

  expect(p.cancel).toBe(_cancel);
});
