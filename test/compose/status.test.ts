import status from '~/compose/status';
import mark from '~/helpers/mark';
import { IStatus } from '~/types';

test(`returns new/mutated status promise`, async () => {
  expect.assertions(6);
  const p = Promise.resolve('foo');

  const m = status(p);
  const n = status(p, true);
  expect(m).toBe(p);
  expect(n).not.toBe(p);
  expect(mark.get(m, 'status')).toBe(true);
  expect(mark.get(n, 'status')).toBe(true);
  await expect(m).resolves.toBe('foo');
  await expect(n).resolves.toBe('foo');
});
test(`initializes correctly`, () => {
  const p: IStatus & Promise<any> = Promise.resolve() as any;
  status(p);

  expect(p.status).toBe('pending');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(null);
});
test(`sets status on resolve`, async () => {
  expect.assertions(4);
  const p: IStatus & Promise<any> = Promise.resolve(10) as any;
  status(p);

  await expect(p).resolves.toBe(10);
  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
test(`sets status on reject`, async () => {
  expect.assertions(4);
  // eslint-disable-next-line prefer-promise-reject-errors
  const p: IStatus & Promise<any> = Promise.reject(10) as any;
  status(p);

  await expect(p).rejects.toBe(10);
  expect(p.status).toBe('rejected');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(10);
});
test(`doesn't run again`, async () => {
  expect.assertions(3);

  const p: IStatus & Promise<any> = Promise.resolve(10) as any;
  status(p);
  await p;
  status(p);

  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
