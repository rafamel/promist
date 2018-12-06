/**
 * @module series
 */

declare const series: {
  map(
    arr: Array<Promise<any> | any>,
    fn: (
      value: any,
      index: number,
      arr: Array<Promise<any> | any>
    ) => Promise<any> | any
  );
  filter(
    arr: Array<Promise<any> | any>,
    fn: (
      value: any,
      index: number,
      arr: Array<Promise<any> | any>
    ) => Promise<any> | any
  );
  reduce(
    arr: Array<Promise<any> | any>,
    fn: (
      accumulator: any,
      value: any,
      index: number,
      arr: Array<Promise<any> | any>
    ) => Promise<any> | any,
    initialValue?: any | Promise<any>
  );
  each(
    arr: Array<Promise<any> | any>,
    fn: (value: any, index: number, arr: Array<Promise<any> | any>) => void
  );
};

export default series;
