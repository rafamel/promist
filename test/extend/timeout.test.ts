import mark from '~/helpers/mark';
import timeout from '~/extend/timeout';

test(`returns new/mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = timeout(100)(p);
  const n = timeout(100)(p, true);

  expect(m).toBe(p);
  expect(n).not.toBe(p);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
  expect(mark.get(m, 'cancellable')).toBe(true);
  expect(mark.get(n, 'cancellable')).toBe(true);
  expect(mark.get(m, 'deferrable')).toBe(true);
  expect(mark.get(n, 'deferrable')).toBe(true);
});
test(`cancels on timeout wo/ reason`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100)(p);

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});

test(`cancels on timeout w/ reason "false"`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100, false)(p);

  let hasResolved = false;
  p.then(() => (hasResolved = true));
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(hasResolved).toBe(false);
});

test(`rejects on timeout w/ reason`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  // @ts-ignore
  timeout(100, 20)(p);

  await expect(p).rejects.toBe(20);
});

test(`rejects on timeout w/ reason for falsy value`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  // @ts-ignore
  timeout(100, 0)(p);

  await expect(p).rejects.toBe(0);
});

test(`rejects on timeout w/ reason as boolean`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 200));
  timeout(100, true)(p);

  await expect(p).rejects.toThrowError('Promise timed out');
});

test(`resolves before timeout`, async () => {
  const p = new Promise((resolve) => setTimeout(() => resolve(10), 100));
  // @ts-ignore
  timeout(200, 20)(p);

  await expect(p).resolves.toBe(10);
});

test(`rejects before timeout`, async () => {
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = new Promise((resolve, reject) => setTimeout(() => reject(10), 100));
  // @ts-ignore
  timeout(200, 20)(p);

  await expect(p).rejects.toBe(10);
});
