/**
 * @module create
 */

export function deferred(): Promise<any>;
export function immediate(): Promise<void>;
export function lazy(
  executor: (resolve: (val: any) => void, reject: (reason: any) => void) => void
): Promise<any>;
export function waitUntil(
  testCb: () => boolean | any,
  ms?: number
): Promise<any>;
export function wait(ms: number): Promise<void>;
