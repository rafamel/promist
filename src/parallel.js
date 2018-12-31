import deferred from './create/deferred';

export function map(arr, fn) {
  return Promise.all(arr).then((resArr) => Promise.all(resArr.map(fn)));
}

export function filter(arr, fn) {
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

export function reduce(arr, cb, initialValue) {
  return Promise.all(arr).then((resArr) => {
    return resArr.slice(1).reduce(
      (acc, x, i) => {
        const p = deferred();
        acc.then((val) => p.resolve(val)).catch((err) => p.reject(err));
        return cb(p, x, i + 1, resArr);
      },
      initialValue === undefined
        ? Promise.resolve(resArr[0])
        : Promise.resolve(
            cb(Promise.resolve(initialValue), resArr[0], 0, resArr)
          )
    );
  });
}

export function each(arr, fn) {
  return map(arr, fn).then(() => {});
}

export default {
  map,
  filter,
  reduce,
  each
};
