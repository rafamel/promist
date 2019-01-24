/**
 * @module parallel
 */

declare const parallel: {
  map<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (value: T, index: number, arr: T[]) => Promise<any> | any
  ): Promise<any[]>;
  filter<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (value: T, index: number, arr: T[]) => Promise<any> | any
  ): Promise<any[]>;
  reduce<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (
      accumulator: Promise<any>,
      value: T,
      index: number,
      arr: T[]
    ) => Promise<any> | any,
    initialValue?: PromiseLike<any> | Promise<any> | any
  ): Promise<any>;
  each<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (value: T, index: number, arr: T[]) => any
  ): Promise<void>;
};

export default parallel;
