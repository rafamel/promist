import { TypeGuard } from 'type-core';
import type { AbortSignal } from 'abort-controller';

import { CancellablePromise } from '../classes';

export interface UntilOptions {
  /** Milliseconds to wait before each `test` execution */
  delay: number;
  /** If `true`, `test` errors will not cause rejections */
  ignoreError?: boolean;
  /** An AbortSignal to trigger cancellation */
  abortSignal?: AbortSignal;
}

/**
 * Will not resolve until `test` returns `true`.
 */
export function until(
  delay: number | UntilOptions,
  test: () => boolean | Promise<boolean>
): CancellablePromise<void> {
  const opts = TypeGuard.isNumber(delay) ? { delay } : delay;

  return new CancellablePromise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | null = null;

    const reset = (): any => {
      timeout = setTimeout(trunk, opts.delay || 0);
    };

    trunk();
    function trunk(): void {
      try {
        Promise.resolve(test()).then(
          (value) => (value ? resolve() : reset()),
          (reason) => (opts.ignoreError ? reset() : reject(reason))
        );
      } catch (err) {
        opts.ignoreError ? reset() : reject(err);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      resolve();
    };
  }, opts.abortSignal);
}
