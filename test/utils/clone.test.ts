import clone from '~/utils/clone';
import { mark } from '~/helpers';

test(`clone is a new promise instance`, () => {
  const foo = Promise.resolve();

  expect(clone(foo)).not.toBe(foo);
});
test(`clone resolves and rejects with the same value`, async () => {
  const foo = Promise.resolve('foo');
  const bar = Promise.reject(Error('Foo'));

  await expect(clone(foo)).resolves.toBe('foo');
  await expect(clone(bar)).rejects.toThrowError('Foo');
});
test(`clone has the extension the source promise had`, () => {
  for (const kind of mark.list) {
    const promise = mark.set(Promise.resolve(), kind);
    expect(mark.get(clone(promise), kind)).toBe(true);
  }
});
test(`clone all extensions the source promise had`, () => {
  const promise = Promise.resolve();
  for (const kind of mark.list) {
    mark.set(promise, kind);
  }
  const extended = clone(promise);
  for (const kind of mark.list) {
    expect(mark.get(extended, kind)).toBe(true);
  }
});
