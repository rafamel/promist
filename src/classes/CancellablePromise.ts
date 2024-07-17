import type { NullaryFn, UnaryFn } from 'type-core';

import { ExtensiblePromise } from './ExtensiblePromise';

export declare namespace CancellablePromise {
  type Executor<T> = (
    resolve: UnaryFn<T | PromiseLike<T>>,
    reject: UnaryFn<Error | unknown>
  ) => NullaryFn;
}

/**
 * A cancellable Promise, taking a cancellation
 * function returning executor.
 * Cancellation can be triggered through
 * the `cancel` method, or by an AbortSignal.
 */
export class CancellablePromise<T> extends ExtensiblePromise<T> {
  #onCancel: NullaryFn | null;
  public constructor(
    executor: CancellablePromise.Executor<T>,
    signal?: AbortSignal | null
  ) {
    let onCancel: NullaryFn | null = null;
    super((resolve, reject) => {
      onCancel = executor(resolve, reject);
    });

    let teardown: NullaryFn | null = null;
    this.#onCancel = () => {
      if (teardown) teardown();
      if (onCancel) onCancel();
    };

    if (signal) {
      if (signal.aborted) this.cancel();
      else {
        const onAbort = (): void => this.cancel();
        teardown = () => signal.removeEventListener('abort', onAbort);
        signal.addEventListener('abort', onAbort);
      }
    }
  }
  public get [Symbol.toStringTag](): string {
    return 'CancellablePromise';
  }
  /**
   * Trigger Promise cancellation
   */
  cancel(): void {
    const onCancel = this.#onCancel;
    if (!onCancel) return;

    this.#onCancel = null;
    onCancel();
  }
}
