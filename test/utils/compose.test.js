import compose from '~/utils/compose';

test(`Doesn't throw on empty`, () => {
  expect(() => compose()).not.toThrow();
});

test(`Returns function`, () => {
  expect(typeof compose()).toBe('function');
});

test(`Works for 0 args`, () => {
  expect(compose()(100)).toBe(100);
});

test(`Works for 1 arg`, () => {
  expect(compose((x) => x * 2)(100)).toBe(200);
});

test(`Executes in order`, () => {
  const fns = [(x) => x / 2, (x) => x / 5, (x) => x * 6, (x) => x / 3];
  expect(compose(...fns)(100)).toBe(20);
});
