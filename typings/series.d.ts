/**
 * @module series
 */

declare const series: {
  map<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | Promise<T> | T>
    ) => Promise<any> | any
  ): Promise<any[]>;
  filter<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | Promise<T> | T>
    ) => Promise<any> | any
  ): Promise<any[]>;
  reduce<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (
      accumulator: any,
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | Promise<T> | T>
    ) => Promise<any> | any,
    initialValue?: PromiseLike<any> | Promise<any> | any
  ): Promise<any>;
  each<T>(
    arr: Array<PromiseLike<T> | Promise<T> | T>,
    fn: (
      value: T,
      index: number,
      arr: Array<PromiseLike<T> | Promise<T> | T>
    ) => any
  ): void;
};

export default series;
