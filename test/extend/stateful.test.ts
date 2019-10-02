import stateful from '~/extend/stateful';
import mark from '~/helpers/mark';
import { IStateful } from '~/types';

test(`returns new/mutated stateful promise`, async () => {
  const p = Promise.resolve('foo');

  const m = stateful(p);
  const n = stateful(p, true);
  expect(m).toBe(p);
  expect(n).not.toBe(p);
  expect(mark.get(m, 'stateful')).toBe(true);
  expect(mark.get(n, 'stateful')).toBe(true);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
});
test(`initializes correctly`, () => {
  const p: IStateful & Promise<any> = Promise.resolve() as any;
  stateful(p);

  expect(p.status).toBe('pending');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(null);
});
test(`sets state on resolve`, async () => {
  const p: IStateful & Promise<any> = Promise.resolve(10) as any;
  stateful(p);

  await expect(p).resolves.toBe(10);
  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
test(`sets state on reject`, async () => {
  // eslint-disable-next-line prefer-promise-reject-errors
  const p: IStateful & Promise<any> = Promise.reject(10) as any;
  stateful(p);

  await expect(p).rejects.toBe(10);
  expect(p.status).toBe('rejected');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(10);
});
test(`doesn't run again`, async () => {
  const p: IStateful & Promise<any> = Promise.resolve(10) as any;
  stateful(p);
  await p;
  stateful(p);

  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
