/**
 * @module utils
 */

export function compose(
  ...fns: Array<(value: any) => any>
): ((value: any) => any);
export function isPromise(obj: any): boolean;
