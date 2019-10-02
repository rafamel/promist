import timed from '~/extend/timed';
import mark from '~/helpers/mark';
import { ITimed } from '~/types';

test(`returns new/mutated timed promise`, async () => {
  const p = Promise.resolve('foo');

  const m = timed(p);
  const n = timed(p, true);
  expect(m).toBe(p);
  expect(n).not.toBe(p);
  expect(mark.get(m, 'timed')).toBe(true);
  expect(mark.get(n, 'timed')).toBe(true);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
});
test(`has promise.time`, () => {
  const p: ITimed & Promise<any> = Promise.resolve() as any;
  timed(p);

  expect(p.time).toBe(null);
});
test(`Has promise.time in ms once resolved`, async () => {
  const p: ITimed & Promise<any> = Promise.resolve(10) as any;
  timed(p);

  await expect(p).resolves.toBe(10);
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
test(`Has promise.time in ms once rejected`, async () => {
  // eslint-disable-next-line prefer-promise-reject-errors
  const p: ITimed & Promise<any> = Promise.reject(10) as any;
  timed(p);

  await expect(p).rejects.toBe(10);
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
test(`Doesn't get timed again if already present`, async () => {
  const p: ITimed & Promise<any> = Promise.resolve(10) as any;
  timed(p);
  await p;
  timed(p);

  expect(p.time).not.toBe(null);
});
