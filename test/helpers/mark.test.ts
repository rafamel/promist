import mark, { MARK_SYMBOL } from '~/helpers/mark';

test(`sets and gets a mark`, () => {
  for (const kind of mark.list) {
    const promise = Promise.resolve(0);
    expect(mark.get(promise, kind)).toBe(false);
    expect(mark.set(promise, kind)).toBe(promise);
    expect(mark.get(promise, kind)).toBe(true);
  }
});
test(`sets and gets all marks`, () => {
  const promise = Promise.resolve(0);

  for (const kind of mark.list) {
    expect(mark.get(promise, kind)).toBe(false);
    expect(mark.set(promise, kind)).toBe(promise);
  }
  for (const kind of mark.list) {
    expect(mark.get(promise, kind)).toBe(true);
  }
});
test(`doesn't reset marks objects on new mark`, () => {
  const promise = Promise.resolve(0);

  mark.set(promise, 'cancellable');
  const obj = (promise as any)[MARK_SYMBOL];
  mark.set(promise, 'deferrable');
  expect((promise as any)[MARK_SYMBOL]).toBe(obj);
});
