import mark from '~/helpers/mark';
import deferred from '~/create/deferred';

test(`promise is marked as deferrable`, () => {
  const p = deferred();
  expect(mark.get(p, 'deferrable')).toBe(true);
});
test(`resolves`, async () => {
  const p = deferred();

  expect(p).toHaveProperty('resolve');
  expect(typeof p.resolve).toBe('function');
  p.resolve(100);
  await expect(p).resolves.toBe(100);
});
test(`calling resolve twice doesn't change first resolution`, async () => {
  const p = deferred();

  p.resolve(100);
  await expect(p).resolves.toBe(100);
  p.resolve(200);
  await expect(p).resolves.toBe(100);
});
test(`rejects`, async () => {
  const p = deferred();

  expect(p).toHaveProperty('reject');
  expect(typeof p.reject).toBe('function');
  p.reject(Error('Foo'));
  await expect(p).rejects.toThrowError('Foo');
});
test(`calling reject twice doesn't change first rejection`, async () => {
  const p = deferred();

  p.reject(Error('Foo'));
  await expect(p).rejects.toThrowError('Foo');

  p.reject(Error('Bar'));
  await expect(p).rejects.toThrowError('Foo');
});
