import { Promist } from '~/classes';

export function map<T>(
  arr: Array<Promise<T> | T>,
  fn: (value: T, index: number, arr: T[]) => Promise<any> | any
): Promise<any[]> {
  return Promise.all(arr).then((resArr) => Promise.all(resArr.map(fn)));
}

export function filter<T>(
  arr: Array<Promise<T> | T>,
  fn: (value: T, index: number, arr: T[]) => Promise<any> | any
): Promise<any[]> {
  const filterVal = {};

  return Promise.all(arr)
    .then((resArr) =>
      Promise.all(
        resArr.map((x, i) =>
          Promise.resolve(fn(x, i, resArr)).then((ans) => (ans ? x : filterVal))
        )
      )
    )
    .then((arr) => arr.filter((x) => x !== filterVal));
}

export function reduce<T>(
  arr: Array<Promise<T> | T>,
  fn: (
    accumulator: Promise<any>,
    value: T,
    index: number,
    arr: T[]
  ) => Promise<any> | any,
  initialValue?: Promise<any> | any
): Promise<any> {
  return Promise.all(arr).then((resArr) => {
    return resArr.slice(1).reduce(
      (acc, x, i) => {
        const p = new Promist();
        acc.then((val) => p.resolve(val)).catch((err) => p.reject(err));
        return fn(p, x, i + 1, resArr);
      },
      initialValue === undefined
        ? Promise.resolve(resArr[0])
        : Promise.resolve(
            fn(Promise.resolve(initialValue), resArr[0], 0, resArr)
          )
    );
  });
}

export function each<T>(
  arr: Array<Promise<T> | T>,
  fn: (value: T, index: number, arr: T[]) => any
): Promise<void> {
  return map(arr, fn).then(() => {});
}

export default {
  map,
  filter,
  reduce,
  each
};
