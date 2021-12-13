import { TypeGuard } from 'type-core';
import { AbortSignal } from 'abort-controller';
import { CancellablePromise } from '../classes';

export interface WaitOptions {
  /** Milliseconds to wait */
  delay: number;
  /** An AbortSignal to trigger cancellation */
  abortSignal?: AbortSignal;
}

/**
 * Will wait for `delay` milliseconds before resolving with an empty response.
 */
export function wait(delay: number | WaitOptions): CancellablePromise<void> {
  const opts = TypeGuard.isNumber(delay) ? { delay } : delay;

  return new CancellablePromise<void>((resolve) => {
    const timeout = setTimeout(resolve, opts.delay || 0);
    return () => {
      clearTimeout(timeout);
      resolve();
    };
  }, opts.abortSignal);
}
