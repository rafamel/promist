/**
 * @module compose
 */

export interface IPromist<T> extends Promise<T> {
  cancel: () => void;
  cancelled: boolean;
  resolve: (val: any) => void;
  reject: (val: any) => void;
  status: string;
  value: any;
  reason: any;
  time: null | number;
}

export function cancellable<T>(
  promise: Promise<T> | PromiseLike<T>
): IPromist<T>;
export function deferrable<T>(
  promise: Promise<T> | PromiseLike<T>
): IPromist<T>;
export function delay(
  ms: number,
  delayRejection?: boolean
): <T>(promise: Promise<T> | PromiseLike<T>) => IPromist<T>;
export function status<T>(promise: Promise<T> | PromiseLike<T>): IPromist<T>;
export function timed<T>(promise: Promise<T> | PromiseLike<T>): IPromist<T>;
export function timeout(
  ms: number,
  reason?: any
): <T>(promise: Promise<T> | PromiseLike<T>) => IPromist<T>;
