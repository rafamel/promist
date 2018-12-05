import mark from '~/helpers/mark';

test(`Sets and gets a mark`, () => {
  const p = Promise.resolve(0);

  expect(() => mark.get(p, 'hello')).not.toThrow();
  expect(mark.get(p, 'hello')).toBe(false);
  expect(() => mark.set(p, 'hello')).not.toThrow();
  expect(mark.get(p, 'hello')).toBe(true);
});

test(`Sets multiple marks`, () => {
  const p = Promise.resolve(0);

  mark.set(p, 'hello', 'bye');

  expect(mark.get(p, 'hello')).toBe(true);
  expect(mark.get(p, 'bye')).toBe(true);
});
