import mark from '~/helpers/mark';
import deferred from '~/create/deferred';

test(`Is marked as deferrable`, () => {
  const p = deferred();
  expect(mark.get(p, 'deferrable')).toBe(true);
});

test(`Resolves`, async () => {
  expect.assertions(3);

  const p = deferred();

  expect(p).toHaveProperty('resolve');
  expect(typeof p.resolve).toBe('function');
  p.resolve(100);
  await expect(p).resolves.toBe(100);
});

test(`Calling resolve() twice doesn't change first resolution`, async () => {
  expect.assertions(2);

  const p = deferred();

  p.resolve(100);
  await expect(p).resolves.toBe(100);
  p.resolve(200);
  await expect(p).resolves.toBe(100);
});

test(`Rejects`, async () => {
  expect.assertions(3);

  const p = deferred();

  expect(p).toHaveProperty('reject');
  expect(typeof p.reject).toBe('function');
  p.reject(100);
  await expect(p).rejects.toBe(100);
});

test(`Calling reject() twice doesn't change first rejection`, async () => {
  expect.assertions(2);

  const p = deferred();

  p.reject(100);
  await expect(p).rejects.toBe(100);
  p.reject(200);
  await expect(p).rejects.toBe(100);
});
