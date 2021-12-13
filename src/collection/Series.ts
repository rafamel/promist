export class Series {
  /**
   * Maps an iterable by running the callback
   * function in series.
   */
  public static async map<T, U>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | T>
    ) => PromiseLike<U> | U
  ): Promise<U[]> {
    const arr = Array.from(iterable);
    const response: U[] = [];

    for (let i = 0; i < arr.length; i++) {
      response.push(await fn(await arr[i], i, arr));
    }

    return response;
  }
  /**
   * Filters an iterable by running the callback
   * function in series.
   */
  public static async filter<T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | T>
    ) => PromiseLike<boolean> | boolean
  ): Promise<T[]> {
    const arr = Array.from(iterable);
    const response: T[] = [];

    for (let i = 0; i < arr.length; i++) {
      const value = await arr[i];
      const select = await fn(value, i, arr);
      if (select) response.push(value);
    }

    return response;
  }
  /**
   * Reduces an iterable by running the callback
   * function in series.
   */
  public static async reduce<T, U = T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (
      accumulator: U,
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | T>
    ) => PromiseLike<U> | U,
    initialValue?: PromiseLike<U> | U
  ): Promise<U> {
    const arr = Array.from(iterable);

    let response: U =
      initialValue === undefined
        ? ((await arr[0]) as any as U)
        : await fn(await initialValue, await arr[0], 0, arr);

    for (let i = 1; i < arr.length; i++) {
      response = await fn(response, await arr[i], i, arr);
    }

    return response;
  }
  /**
   * Runs a callback for each item of
   * an Iterable in series.
   */
  public static async each<T>(
    iterable: Iterable<PromiseLike<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | T>
    ) => PromiseLike<void> | void
  ): Promise<void> {
    await Series.map(iterable, fn);
  }
}
