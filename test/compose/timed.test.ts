import timed from '~/compose/timed';
import mark from '~/helpers/mark';
import { ITimed } from '~/types';

test(`is marked as timed`, () => {
  const p: ITimed & Promise<any> = Promise.resolve() as any;
  timed(p);

  expect(mark.get(p, 'timed')).toBe(true);
});
test(`has promise.time`, () => {
  const p: ITimed & Promise<any> = Promise.resolve() as any;
  timed(p);

  expect(p.time).toBe(null);
});
test(`Has promise.time in ms once resolved`, async () => {
  expect.assertions(3);

  const p: ITimed & Promise<any> = Promise.resolve(10) as any;
  timed(p);

  await expect(p).resolves.toBe(10);
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
test(`Has promise.time in ms once rejected`, async () => {
  expect.assertions(3);

  // eslint-disable-next-line prefer-promise-reject-errors
  const p: ITimed & Promise<any> = Promise.reject(10) as any;
  timed(p);

  await expect(p).rejects.toBe(10);
  expect(typeof p.time).toBe('number');
  expect(p.time).toBeLessThan(50);
});
test(`Doesn't get timed again if already present`, async () => {
  expect.assertions(1);

  const p: ITimed & Promise<any> = Promise.resolve(10) as any;
  timed(p);
  await p;
  timed(p);

  expect(p.time).not.toBe(null);
});
