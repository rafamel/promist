import { type Callable, TypeGuard } from 'type-core';

import { Util } from './helpers/Util';
import { ExtensiblePromise } from './ExtensiblePromise';

export declare namespace SyncPromise {
  type Executor<T> = (
    resolve: Callable<T | PromiseLike<T>>,
    reject: Callable<Error | unknown>
  ) => void;
}

/**
 * A promise that will make its resolved or rejected values
 * synchronously available and operable.
 */
export class SyncPromise<T> extends ExtensiblePromise<T> {
  /**
   * Creates a SyncPromise from a function.
   */
  public static from<T>(
    create: Callable<void, T | PromiseLike<T>>
  ): SyncPromise<T> {
    return new SyncPromise((resolve, reject) => {
      try {
        const response = create();
        if (TypeGuard.isPromiseLike(response)) {
          Promise.resolve(response).then(resolve, reject);
        } else {
          resolve(response);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  #response: { data: null | [T] | [null, Error | unknown] };
  public constructor(executor: SyncPromise.Executor<T>) {
    let complete = false;
    const response: { data: null | [T] | [null, Error | unknown] } = {
      data: null
    };

    super((resolve, reject) => {
      executor(
        (value) => {
          if (complete) return;

          complete = true;
          if (TypeGuard.isPromiseLike(value)) {
            Promise.resolve(value).then(
              (value) => {
                response.data = [value];
              },
              (reason) => {
                response.data = [null, reason];
              }
            );
          } else {
            response.data = [value];
          }
          resolve(value);
        },
        (reason) => {
          if (complete) return;

          complete = true;
          response.data = [null, reason];
          reject(reason);
        }
      );
    });

    this.#response = response;
  }
  public get [Symbol.toStringTag](): string {
    return 'SyncPromise';
  }
  /**
   * Returns a Promise if pending, otherwise
   * it will synchronously return or throw.
   */
  public consume(): T | Promise<T> {
    const data = this.#response.data;
    if (!data) return Promise.resolve(this);
    if (data.length === 1) return data[0];

    // prevent promise rejection
    this.catch(() => undefined);

    throw data[1];
  }
  /**
   * An agnostic and chainable method to operate
   * on a SyncPromise. It will execute asynchronously
   * if values are pending, and synchronously otherwise.
   */
  public operate<TS = T, TF = never>(
    success?: Callable<T, TS | PromiseLike<TS>> | null,
    failure?: Callable<Error | unknown, TF | PromiseLike<TF>> | null,
    finalize?: Callable<void, void | PromiseLike<void>> | null
  ): SyncPromise<TS | TF> {
    return new SyncPromise<TS | TF>((resolve, reject) => {
      Util.operate(
        () => this.consume(),
        (value) => {
          if (success) {
            return Util.operate(
              () => success(value),
              (response) => {
                return finalize
                  ? Util.operate(finalize, () => resolve(response), reject)
                  : resolve(response);
              },
              (err) => {
                return finalize
                  ? Util.operate(finalize, () => reject(err), reject)
                  : reject(err);
              }
            );
          } else if (finalize) {
            return Util.operate(
              finalize,
              () => resolve(value as any as TS),
              reject
            );
          } else {
            return resolve(value as any as TS);
          }
        },
        (err) => {
          if (failure) {
            return Util.operate(
              () => failure(err),
              (response) => {
                return finalize
                  ? Util.operate(finalize, () => resolve(response), reject)
                  : resolve(response);
              },
              (err) => {
                return finalize
                  ? Util.operate(finalize, () => reject(err), reject)
                  : reject(err);
              }
            );
          } else if (finalize) {
            return Util.operate(finalize, () => reject(err), reject);
          } else {
            return reject(err);
          }
        }
      );
    });
  }
}
