/**
 * @module create
 */

export interface IDeferrable<T> extends Promise<T> {
  resolve: (val: any) => void;
  reject: (reason: any) => void;
}

export function deferred(): IDeferrable<any>;
export function immediate(): Promise<void>;
export function lazy(
  executor: (resolve: (val: any) => void, reject: (reason: any) => void) => void
): Promise<any>;
export function waitUntil(
  testCb: () => boolean | PromiseLike<boolean> | Promise<boolean>,
  ms?: number
): Promise<void>;
export function wait(ms: number): Promise<void>;
