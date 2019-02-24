import status from '~/compose/status';
import mark from '~/helpers/mark';
import { IStatus } from '~/types';

test(`should be marked as status`, () => {
  const p: IStatus & Promise<any> = Promise.resolve() as any;
  status(p);

  expect(mark.get(p, 'status')).toBe(true);
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
