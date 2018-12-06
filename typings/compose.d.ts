/**
 * @module compose
 */

export function cancellable(promise: Promise<any>): Promise<any>;
export function deferrable(promise: Promise<any>): Promise<any>;
export function delay(
  ms: number,
  delayRejection?: boolean
): (promise: Promise<any>) => Promise<any>;
export function status(promise: Promise<any>): Promise<any>;
export function timed(promise: Promise<any>): Promise<any>;
export function timeout(
  ms: number,
  reason?: any
): (promise: Promise<any>) => Promise<any>;
