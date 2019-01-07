/**
 * @module utils
 */
import { IPromist } from './compose';

export function compose(
  ...fns: Array<(value: any) => any>
): ((value: any) => any);
export function isPromise(obj: any): boolean;
