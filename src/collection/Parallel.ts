export class Parallel {
  /**
   * Maps an iterable by running the callback
   * function in parallel.
   */
  public static async map<T, U>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (value: T, index: number, arr: T[]) => PromiseLike<U> | U
  ): Promise<U[]> {
    const arr = Array.from(iterable);
    const response = await Promise.all(arr);
    return Promise.all(response.map(fn));
  }
  /**
   * Filters an iterable by running the callback
   * function in parallel.
   */
  public static async filter<T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (value: T, index: number, arr: T[]) => PromiseLike<boolean> | boolean
  ): Promise<T[]> {
    const skip = {};
    const arr = Array.from(iterable);
    const values = await Parallel.map(
      arr,
      async (x, i, arr): Promise<T | typeof skip> => {
        const select = await fn(x, i, arr);
        return select ? x : skip;
      }
    );
    return values.filter((x): x is T => x !== skip);
  }
  /**
   * Reduces an iterable by running the callback
   * function in parallel.
   */
  public static async reduce<T, U = T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (
      accumulator: Promise<U>,
      value: T,
      index: number,
      arr: T[]
    ) => PromiseLike<U> | U,
    initialValue?: PromiseLike<U> | U
  ): Promise<U> {
    const arr = Array.from(iterable);
    const values = await Promise.all(arr);

    let acc: Promise<U> =
      initialValue === undefined
        ? Promise.resolve(arr[0] as any as U)
        : Promise.resolve(
            fn(Promise.resolve(initialValue), await arr[0], 0, values)
          );

    for (let i = 1; i < arr.length; i++) {
      acc = Promise.resolve(fn(acc, await arr[i], i, values));
    }

    return acc;
  }
  /**
   * Runs a callback for each item of
   * an Iterable in parallel.
   */
  public static async each<T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (value: T, index: number, arr: T[]) => PromiseLike<void> | void
  ): Promise<void> {
    await Parallel.map(iterable, fn);
  }
}
