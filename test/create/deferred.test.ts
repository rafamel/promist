import mark from '~/helpers/mark';
import deferred from '~/create/deferred';

test(`Is marked as deferrable`, () => {
  const p = deferred();
  expect(mark.get(p, 'deferrable')).toBe(true);
});

test(`Resolves`, async () => {
  const p = deferred();

  expect(p).toHaveProperty('resolve');
  expect(typeof p.resolve).toBe('function');
  p.resolve(100);
  await expect(p).resolves.toBe(100);
});

test(`Calling resolve() twice doesn't change first resolution`, async () => {
  const p = deferred();

  p.resolve(100);
  await expect(p).resolves.toBe(100);
  p.resolve(200);
  await expect(p).resolves.toBe(100);
});

test(`Rejects`, async () => {
  const p = deferred();

  expect(p).toHaveProperty('reject');
  expect(typeof p.reject).toBe('function');
  // @ts-ignore
  p.reject(100);
  await expect(p).rejects.toBe(100);
});

test(`Calling reject() twice doesn't change first rejection`, async () => {
  const p = deferred();

  // @ts-ignore
  p.reject(100);
  await expect(p).rejects.toBe(100);
  // @ts-ignore
  p.reject(200);
  await expect(p).rejects.toBe(100);
});
