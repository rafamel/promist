/**
 * @module create
 */

import { IDeferrable } from './core';

export function deferred(): IDeferrable & Promise<any>;
export function immediate(): Promise<void>;
export function lazy(
  executor: (
    resolve: (val?: any) => void,
    reject: (reason: Error) => void
  ) => void
): Promise<any>;
export function waitUntil(
  testCb: () => boolean | PromiseLike<boolean> | Promise<boolean>,
  ms?: number
): Promise<void>;
export function wait(ms: number): Promise<void>;
