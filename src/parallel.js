export function map(arr, fn) {
  return Promise.all(arr).then((resArr) => Promise.all(resArr.map(fn)));
}

export function filter(arr, fn) {
  const filterVal = {};

  return Promise.all(arr)
    .then((resArr) =>
      Promise.all(
        resArr.map(async (x, i) => ((await fn(x, i, resArr)) ? x : filterVal))
      )
    )
    .then((arr) => arr.filter((x) => x !== filterVal));
}

export function reduce(arr, cb, initialValue) {
  return Promise.all(arr).then(async (resArr) => {
    let val = await (initialValue === undefined ? arr[0] : initialValue);
    let start = initialValue === undefined ? 1 : 0;

    for (let i = start; i < arr.length; i++) {
      val = await cb(val, resArr[i], i, resArr);
    }
    return val;
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
