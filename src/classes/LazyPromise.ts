import type { NullaryFn, UnaryFn } from 'type-core';

import { Util } from './helpers/Util';
import { ExtensiblePromise } from './ExtensiblePromise';

export declare namespace LazyPromise {
  type Executor<T> = (
    resolve: UnaryFn<T | PromiseLike<T>>,
    reject: UnaryFn<Error | unknown>
  ) => void;
}

/**
 * A Promise whose executor will not execute
 * until the first time it is awaited.
 */
export class LazyPromise<T> extends ExtensiblePromise<T> {
  /**
   * Creates a LazyPromise from a function.
   */
  public static from<T>(create: NullaryFn<T | PromiseLike<T>>): LazyPromise<T> {
    return new LazyPromise<T>((resolve, reject) => {
      Promise.resolve()
        .then(() => create())
        .then(resolve, reject);
    });
  }
  #execute: NullaryFn;
  public constructor(executor: LazyPromise.Executor<T>) {
    let execute = Util.noop;
    super((resolve, reject) => {
      execute = () => executor(resolve, reject);
    });
    this.#execute = () => {
      this.#execute = Util.noop;
      execute();
    };
  }
  public get [Symbol.toStringTag](): string {
    return 'LazyPromise';
  }
  public then<TS = T, TF = never>(
    onfulfilled?: UnaryFn<T, TS | PromiseLike<TS>> | undefined | null,
    onrejected?:
      | UnaryFn<Error | unknown, TF | PromiseLike<TF>>
      | undefined
      | null
  ): Promise<TS | TF> {
    this.#execute();
    return super.then(onfulfilled, onrejected);
  }
  public catch<TF = never>(
    onrejected?:
      | UnaryFn<Error | unknown, TF | PromiseLike<TF>>
      | undefined
      | null
  ): Promise<T | TF> {
    this.#execute();
    return super.catch(onrejected);
  }
  public finally(onfinally?: NullaryFn | undefined | null): Promise<T> {
    this.#execute();
    return super.finally(onfinally);
  }
}
