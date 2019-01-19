export default function generate(test, generator) {
  return async (...args) => {
    const iterator = generator(...args);
    let value;
    let done;

    let testRes;
    while (!done && (testRes = await test()) && !(testRes instanceof Error)) {
      const next = iterator.next(await value);
      value = next.value;
      done = next.done;
    }

    if (testRes instanceof Error) throw testRes;
    return testRes ? value : new Promise(() => {});
  };
}
