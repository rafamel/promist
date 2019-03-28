import asNew from '../../src/helpers/as-new';

test(`returns the same promise`, () => {
  const p = Promise.resolve();
  expect(asNew(p)).toBe(p);
  expect(asNew(p, false)).toBe(p);
});
test(`returns new promise`, async () => {
  const p = Promise.resolve('foo');
  expect(asNew(p, true)).not.toBe(p);
  await expect(asNew(p, true)).resolves.toBe('foo');
});
