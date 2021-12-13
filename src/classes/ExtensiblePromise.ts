import { NullaryFn, UnaryFn } from 'type-core';

export declare namespace ExtensiblePromise {
  type Executor<T> = (
    resolve: UnaryFn<T | PromiseLike<T>>,
    reject: UnaryFn<Error | unknown>
  ) => void;
}

/**
 * A safe to extend Promise, as its methods will
 * not use the new class' constructor,
 * but the one of the global Promise object.
 */
export class ExtensiblePromise<T> implements Promise<T> {
  #promise: Promise<T>;
  public constructor(executor: ExtensiblePromise.Executor<T>) {
    this.#promise = new Promise(executor);
  }
  public get [Symbol.toStringTag](): string {
    return 'ExtensiblePromise';
  }
  public then<TS = T, TF = never>(
    onfulfilled?: UnaryFn<T, TS | PromiseLike<TS>> | undefined | null,
    onrejected?:
      | UnaryFn<Error | unknown, TF | PromiseLike<TF>>
      | undefined
      | null
  ): Promise<TS | TF> {
    return this.#promise.then(onfulfilled, onrejected);
  }
  public catch<TF = never>(
    onrejected?:
      | UnaryFn<Error | unknown, TF | PromiseLike<TF>>
      | undefined
      | null
  ): Promise<T | TF> {
    return this.#promise.catch(onrejected);
  }
  public finally(onfinally?: NullaryFn | undefined | null): Promise<T> {
    return this.#promise.finally(onfinally);
  }
}
