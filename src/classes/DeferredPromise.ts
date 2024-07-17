import type { UnaryFn } from 'type-core';

import { Util } from './helpers/Util';
import { ExtensiblePromise } from './ExtensiblePromise';

/**
 * An externally actionable Promise
 * with `resolve` and `reject` methods.
 */
export class DeferredPromise<T> extends ExtensiblePromise<T> {
  #resolve: UnaryFn<T | PromiseLike<T>>;
  #reject: UnaryFn<Error | unknown>;
  public constructor() {
    let res: UnaryFn<T | PromiseLike<T>> = Util.noop;
    let rej: UnaryFn<Error | unknown> = Util.noop;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    this.#resolve = res;
    this.#reject = rej;
  }
  public get [Symbol.toStringTag](): string {
    return 'DeferredPromise';
  }
  /**
   * Resolves the promise with `value`.
   */
  public resolve(value: T | PromiseLike<T>): void {
    this.#resolve(value);
  }
  /**
   * Rejects the promise with `reason`.
   */
  public reject(reason: Error | unknown): void {
    this.#reject(reason);
  }
}
