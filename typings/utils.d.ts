/**
 * @module utils
 */

export function compose(
  ...fns: Array<(value: any) => any>
): ((value: any) => any);

export function control<T, A extends any[]>(
  test: () => Promise<boolean | Error> | boolean | Error,
  generator:
    | ((...args: A) => IterableIterator<Promise<T>>)
    | ((...args: A) => IterableIterator<T>)
): (...args: A) => Promise<T>;

export function isPromise(obj: any): boolean;
