import status from '~/compose/status';
import mark from '~/helpers/mark';

test(`should be marked as status`, () => {
  const p = Promise.resolve();
  status(p);
  expect(mark.get(p, 'status')).toBe(true);
});

test(`initializes correctly`, () => {
  const p = Promise.resolve();
  status(p);
  expect(p.status).toBe('pending');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(null);
});

test(`sets status on resolve`, async () => {
  expect.assertions(4);
  const p = Promise.resolve(10);
  status(p);

  await expect(p).resolves.toBe(10);
  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});

test(`sets status on reject`, async () => {
  expect.assertions(4);
  // eslint-disable-next-line prefer-promise-reject-errors
  const p = Promise.reject(10);
  status(p);

  await expect(p).rejects.toBe(10);
  expect(p.status).toBe('rejected');
  expect(p.value).toBe(null);
  expect(p.reason).toBe(10);
});

test(`doesn't run again`, async () => {
  expect.assertions(3);

  const p = Promise.resolve(10);
  status(p);
  await p;
  status(p);

  expect(p.status).toBe('resolved');
  expect(p.value).toBe(10);
  expect(p.reason).toBe(null);
});
