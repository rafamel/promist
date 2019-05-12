import compose, { trunk } from '~/utils/compose';
import status from '~/compose/status';
import timed from '~/compose/timed';

describe(`compose`, () => {
  test(`no fn`, async () => {
    const promise = Promise.resolve(1);
    const fn = compose();

    expect(fn(promise)).toBe(promise);
    await expect(fn(promise)).resolves.toBe(1);

    expect(fn(promise, true)).not.toBe(promise);
    await expect(fn(promise, true)).resolves.toBe(1);
  });
  test(`single fn`, async () => {
    const promise = Promise.resolve(1);
    const fn = compose(status);

    expect(fn(promise)).toBe(promise);
    expect(fn(promise)).toHaveProperty('status');
    await expect(fn(promise)).resolves.toBe(1);

    expect(fn(promise, true)).not.toBe(promise);
    expect(fn(promise, true)).toHaveProperty('status');
    await expect(fn(promise, true)).resolves.toBe(1);
  });
  test(`multiple fns`, async () => {
    const promise = Promise.resolve(1);
    const fn = compose(
      status,
      timed
    );

    expect(fn(promise)).toBe(promise);
    expect(fn(promise)).toHaveProperty('status');
    expect(fn(promise)).toHaveProperty('time');
    await expect(fn(promise)).resolves.toBe(1);

    expect(fn(promise, true)).not.toBe(promise);
    expect(fn(promise, true)).toHaveProperty('status');
    expect(fn(promise)).toHaveProperty('time');
    await expect(fn(promise, true)).resolves.toBe(1);
  });
});

describe(`trunk`, () => {
  test(`Doesn't throw on empty`, () => {
    expect(() => trunk()).not.toThrow();
  });
  test(`Returns function`, () => {
    expect(typeof trunk()).toBe('function');
  });
  test(`Works for 0 args`, () => {
    expect(trunk()(100)).toBe(100);
  });
  test(`Works for 1 arg`, () => {
    expect(trunk((x) => x * 2)(100)).toBe(200);
  });
  test(`Executes in order`, () => {
    const fns = [
      (x: number) => x / 2,
      (x: number) => x / 5,
      (x: number) => x * 6,
      (x: number) => x / 3
    ];
    expect(trunk(...fns)(100)).toBe(20);
  });
});
