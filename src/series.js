export async function map(arr, cb) {
  const ans = [];
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line standard/no-callback-literal
    const res = await cb(await arr[i], i, arr);
    ans.push(res);
  }
  return ans;
}

export async function filter(arr, cb) {
  const ans = [];
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line standard/no-callback-literal
    const val = await arr[i];
    if (await cb(val, i, arr)) ans.push(val);
  }
  return ans;
}

export async function reduce(arr, cb, initialValue) {
  let val = await (initialValue === undefined ? arr[0] : initialValue);
  let start = initialValue === undefined ? 1 : 0;

  for (let i = start; i < arr.length; i++) {
    val = await cb(val, await arr[i], i, arr);
  }
  return val;
}

export async function each(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line standard/no-callback-literal
    await cb(await arr[i], i, arr);
  }
}

export default {
  map,
  filter,
  reduce,
  each
};
