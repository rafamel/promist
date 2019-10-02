import isPromise from '~/utils/is-promise';

test(`returns true for promise`, () => {
  const p = Promise.resolve();

  expect(isPromise(p)).toBe(true);
});
test(`Returns true for thenables`, () => {
  const a = { then: (): void => {} };
  const b = (): void => {};
  b.then = () => {};

  expect(isPromise(a)).toBe(true);
  expect(isPromise(b)).toBe(true);
});
test(`returns false for non-promises`, () => {
  const [a, b, c, d] = [1, 'hi', {}, []];

  expect(isPromise(a)).toBe(false);
  expect(isPromise(b)).toBe(false);
  expect(isPromise(c)).toBe(false);
  expect(isPromise(d)).toBe(false);
});
test(`returns false for non-promises (2)`, () => {
  const a = { then: 1 };
  const b = { catch: (): void => {} };
  const c = {
    catch: (): void => {},
    finally: (): void => {}
  };

  expect(isPromise(a)).toBe(false);
  expect(isPromise(b)).toBe(false);
  expect(isPromise(c)).toBe(false);
});
