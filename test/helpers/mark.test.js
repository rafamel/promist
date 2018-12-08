import mark, { MARK_SYMBOL } from '~/helpers/mark';

test(`Sets and gets a mark`, () => {
  const p = Promise.resolve(0);

  expect(() => mark.get(p, 'hello')).not.toThrow();
  expect(mark.get(p, 'hello')).toBe(false);
  expect(() => mark.set(p, 'hello')).not.toThrow();
  expect(mark.get(p, 'hello')).toBe(true);
});

test(`Doesn't reset marks objects on new mark`, () => {
  const p = Promise.resolve(0);

  mark.set(p, 'hello');
  const obj = p[MARK_SYMBOL];
  mark.set(p, 'bye');

  expect(p[MARK_SYMBOL]).toBe(obj);
  expect(mark.get(p, 'hello')).toBe(true);
  expect(mark.get(p, 'bye')).toBe(true);
});

test(`Sets multiple marks`, () => {
  const p = Promise.resolve(0);

  mark.set(p, 'hello', 'bye');

  expect(mark.get(p, 'hello')).toBe(true);
  expect(mark.get(p, 'bye')).toBe(true);
});
