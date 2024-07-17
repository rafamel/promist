import { TypeGuard } from 'type-core';
import type { AbortSignal } from 'abort-controller';

import { CancellablePromise } from '../classes';
import { Util } from '../classes/helpers/Util';

export interface WaitOptions {
  /** Milliseconds to wait. An empty delay will prompt immediate resolution. */
  delay?: number | null;
  /** An AbortSignal to trigger cancellation. */
  abortSignal?: AbortSignal;
}

/**
 * Will wait for `delay` milliseconds before resolving with an empty response.
 */
export function wait(
  delay?: number | null | WaitOptions
): CancellablePromise<void> {
  const opts = TypeGuard.isNumber(delay) ? { delay } : delay || {};

  return new CancellablePromise<void>((resolve) => {
    if (TypeGuard.isNumber(opts.delay)) {
      const timeout = setTimeout(resolve, Math.max(0, opts.delay || 0));
      return () => {
        clearTimeout(timeout);
        resolve();
      };
    } else {
      resolve();
      return Util.noop;
    }
  }, opts.abortSignal);
}
