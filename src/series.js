export function map(arr, cb) {
  const ans = [];

  return arr
    .reduce((acc, x, i) => {
      return acc
        .then(() => x)
        .then((val) => cb(val, i, arr))
        .then((res) => ans.push(res));
    }, Promise.resolve())
    .then(() => ans);
}

export function filter(arr, cb) {
  const ans = [];

  return arr
    .reduce((acc, x, i) => {
      return acc
        .then(() => x)
        .then((val) =>
          Promise.resolve(cb(val, i, arr)).then((res) => res && ans.push(val))
        );
    }, Promise.resolve())
    .then(() => ans);
}

export function reduce(arr, cb, initialValue) {
  return arr
    .slice(1)
    .reduce(
      (acc, x, i) =>
        acc.then((val) =>
          Promise.resolve(x).then((x) => cb(val, x, i + 1, arr))
        ),
      initialValue === undefined
        ? Promise.resolve(arr[0])
        : Promise.resolve(initialValue).then((val) =>
            Promise.resolve(arr[0]).then((x) => cb(val, x, 0, arr))
          )
    );
}

export function each(arr, cb) {
  return arr
    .reduce((acc, x, i) => {
      return acc.then(() => x).then((val) => cb(val, i, arr));
    }, Promise.resolve())
    .then(() => {});
}

export default {
  map,
  filter,
  reduce,
  each
};
