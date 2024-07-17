import { TypeGuard } from 'type-core';
import type { AbortSignal } from 'abort-controller';

import { CancellablePromise } from '../classes';

export interface TimeoutOptions {
  /** Set a delay for cancellation */
  delay: number;
  /** An AbortSignal to trigger cancellation */
  abortSignal?: AbortSignal;
}

/**
 * Will cancel a CancellablePromise in `delay` milliseconds
 */
export function timeout<T, U>(
  delay: number | TimeoutOptions,
  executor: CancellablePromise.Executor<T>
): CancellablePromise<T | U> {
  const opts = TypeGuard.isNumber(delay) ? { delay } : delay;

  const promise = new CancellablePromise<T | U>((resolve, reject) => {
    const timeout = setTimeout(() => promise.cancel(), opts.delay);

    const onCancel = executor(resolve, reject);
    return () => {
      if (timeout) clearTimeout(timeout);
      onCancel();
    };
  }, opts.abortSignal);

  return promise;
}
