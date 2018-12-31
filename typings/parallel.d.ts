/**
 * @module parallel
 */

declare const parallel: {
  map(
    arr: Array<Promise<any> | any>,
    fn: (value: any, index: number, arr: any[]) => Promise<any> | any
  );
  filter(
    arr: Array<Promise<any> | any>,
    fn: (value: any, index: number, arr: any[]) => Promise<any> | any
  );
  reduce(
    arr: Array<Promise<any> | any>,
    fn: (
      accumulator: Promise<any>,
      value: any,
      index: number,
      arr: any[]
    ) => Promise<any> | any,
    initialValue?: any | Promise<any>
  );
  each(
    arr: Array<Promise<any> | any>,
    fn: (value: any, index: number, arr: any[]) => void
  );
};

export default parallel;
