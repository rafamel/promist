import { timed } from '~/extend';
import extend from '~/extend/timed';
import mark from '~/helpers/mark';

test(`named export returns a new promise`, async () => {
  const p = Promise.resolve('foo');
  const n = timed(p);

  expect(n).not.toBe(p);
  await expect(n).resolves.toBe('foo');
  expect(mark.get(n, 'timed')).toBe(true);
});
test(`default export returns a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  const m = extend(p);

  expect(m).toBe(p);
  await expect(m).resolves.toBe('foo');
  expect(mark.get(m, 'timed')).toBe(true);
});
test(`default export doesn't run again on a mutated promise`, async () => {
  const p = Promise.resolve('foo');
  let m = extend(p);
  await m;
  const time = m.time;
  m = extend(m);

  expect(m.time).toBe(time);
});
test(`has promise.time`, () => {
  const p = timed(Promise.resolve());

  expect(p.time).toBe(null);
});
test(`has promise.time in ms once resolved`, async () => {
  const p = timed(Promise.resolve(10));

  await expect(p).resolves.toBe(10);
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
test(`has promise.time in ms once rejected`, async () => {
  const p = timed(Promise.reject(Error('Foo')));

  await expect(p).rejects.toThrowError('Foo');
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
