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

test(`Rejects`, async () => {
  expect.assertions(3);

  const p = deferred();

  expect(p).toHaveProperty('reject');
  expect(typeof p.reject).toBe('function');
  p.reject(100);
  await expect(p).rejects.toBe(100);
});
