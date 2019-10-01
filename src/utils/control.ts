export default function control<T, A extends any[]>(
  test: () => Promise<boolean | Error> | boolean | Error,
  generator: (...args: A) => Generator<Promise<T> | T, Promise<T> | T, T>
): (...args: A) => Promise<T> {
  return async (...args) => {
    const iterator = generator(...args);
    let value;
    let done;

    let testRes;
    while (!done && (testRes = await test()) && !(testRes instanceof Error)) {
      const next: any = iterator.next(await value);
      value = next.value;
      done = next.done;
    }

    if (testRes instanceof Error) throw testRes;
    return testRes ? value : new Promise(() => {});
  };
}
