import { describe, expect, test } from 'vitest';

import { isPromise, isPromiseLike } from '../../src/utils';

describe(`isPromise`, () => {
  test(`returns true for promise`, () => {
    const p = Promise.resolve();

    expect(isPromise(p)).toBe(true);
  });
  test(`Returns false for thenables`, () => {
    const a = { then: (): void => undefined };
    const b = (): void => undefined;
    b.then = () => undefined;

    expect(isPromise(a)).toBe(false);
    expect(isPromise(b)).toBe(false);
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
    const b = { catch: (): void => undefined };
    const c = {
      catch: (): void => undefined,
      finally: (): void => undefined
    };

    expect(isPromise(a)).toBe(false);
    expect(isPromise(b)).toBe(false);
    expect(isPromise(c)).toBe(false);
  });
});

describe(`isPromiseLike`, () => {
  test(`returns true for promise`, () => {
    const p = Promise.resolve();

    expect(isPromiseLike(p)).toBe(true);
  });
  test(`Returns true for thenables`, () => {
    const a = { then: (): void => undefined };
    const b = (): void => undefined;
    b.then = () => undefined;

    expect(isPromiseLike(a)).toBe(true);
    expect(isPromiseLike(b)).toBe(false);
  });
  test(`returns false for non-promises`, () => {
    const [a, b, c, d] = [1, 'hi', {}, []];

    expect(isPromiseLike(a)).toBe(false);
    expect(isPromiseLike(b)).toBe(false);
    expect(isPromiseLike(c)).toBe(false);
    expect(isPromiseLike(d)).toBe(false);
  });
  test(`returns false for non-promises (2)`, () => {
    const a = { then: 1 };
    const b = { catch: (): void => undefined };
    const c = {
      catch: (): void => undefined,
      finally: (): void => undefined
    };

    expect(isPromiseLike(a)).toBe(false);
    expect(isPromiseLike(b)).toBe(false);
    expect(isPromiseLike(c)).toBe(false);
  });
});
