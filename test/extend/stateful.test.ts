import { stateful } from '~/extend';
import extend from '~/extend/stateful';
import mark from '~/helpers/mark';

test(`named export returns a new promise`, async () => {
  const p = Promise.resolve('foo');
  const n = stateful(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe('foo');
  expect(mark.get(n, 'stateful')).toBe(true);
});
test(`default export returns a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = extend(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe('foo');
  expect(mark.get(m, 'stateful')).toBe(true);
});
test(`default export doesn't run again on a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  let m = extend(p);
  await m;
  const status = m.status;
  m = extend(m);

  expect(m.status).toBe(status);
});
test(`initializes correctly`, () => {
  const p = stateful(Promise.resolve());

  expect(p.status).toBe('pending');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(null);
});
test(`sets state on resolve`, async () => {
  const p = stateful(Promise.resolve(10));

  await expect(p).resolves.toBe(10);
  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
test(`sets state on reject`, async () => {
  const error = Error('Foo');
  const p = stateful(Promise.reject(error));

  await expect(p).rejects.toThrowError('Foo');
  expect(p.status).toBe('rejected');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(error);
});
