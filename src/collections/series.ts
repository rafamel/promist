export function map<T>(
  arr: Array<Promise<T> | T>,
  fn: (
    value: T,
    index: number,
    arr: Array<Promise<T> | T>
  ) => Promise<any> | any
): Promise<any[]> {
  const ans: any[] = [];

  return arr
    .reduce((acc: Promise<any>, x, i) => {
      return acc
        .then(() => x)
        .then((val) => fn(val, i, arr))
        .then((res) => ans.push(res));
    }, Promise.resolve())
    .then(() => ans);
}

export function filter<T>(
  arr: Array<Promise<T> | T>,
  fn: (
    value: T,
    index: number,
    arr: Array<Promise<T> | T>
  ) => Promise<any> | any
): Promise<any[]> {
  const ans: any[] = [];

  return arr
    .reduce((acc: Promise<any>, x, i) => {
      return acc
        .then(() => x)
        .then((val) =>
          Promise.resolve(fn(val, i, arr)).then((res) => res && ans.push(val))
        );
    }, Promise.resolve())
    .then(() => ans);
}

export function reduce<T>(
  arr: Array<Promise<T> | T>,
  fn: (
    accumulator: any,
    value: T,
    index: number,
    arr: Array<Promise<T> | T>
  ) => Promise<any> | any,
  initialValue?: Promise<any> | any
): Promise<any> {
  return arr
    .slice(1)
    .reduce(
      (acc, x, i) =>
        acc.then((val) =>
          Promise.resolve(x).then((x) => fn(val, x, i + 1, arr))
        ),
      initialValue === undefined
        ? Promise.resolve(arr[0])
        : Promise.resolve(initialValue).then((val) =>
            Promise.resolve(arr[0]).then((x) => fn(val, x, 0, arr))
          )
    );
}

export function each<T>(
  arr: Array<Promise<T> | T>,
  fn: (value: T, index: number, arr: Array<Promise<T> | T>) => any
): Promise<void> {
  return arr
    .reduce((acc, x, i) => {
      return acc.then(() => x).then((val) => fn(val, i, arr));
    }, Promise.resolve())
    .then(() => undefined);
}

export default {
  map,
  filter,
  reduce,
  each
};
