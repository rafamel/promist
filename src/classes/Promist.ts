import { ObservableDefinition } from '../types';
import {
  PromistStatus,
  PromistExecutor,
  RequiredType,
  PromiseExecutor
} from './types';
import { until } from '~/create';

const INTERNAL_SYMBOL = Symbol('internal');

export interface Internal<T> {
  promise: Promise<T>;
  state: InternalState<T>;
  actions: InternalActions<T>;
  oncomplete?: () => void;
}

export interface InternalState<T> {
  status: PromistStatus;
  value: T | null;
  reason: Error | null;
}

interface InternalActions<T> {
  resolve: (value?: T) => void;
  reject: (reason: Error) => void;
}

/**
 * `Promist` behaves just like a traditional `Promise`, with a few
 * additional features:
 * - It can be externally resolved and/or rejected.
 * - It can also be externally cancelled. If using an executor on
 * the `Promist` constructor, you can receive external completion
 * events  (resolution/rejection/cancellation) via the returned
 * callback, in order to free up resources, if needed. Externally,
 * you also have access to this event (including cancellation)
 * via the `Promist.react` promise.
 * - It will always have the `finally` method available,
 * regardless of the underlying `Promise` implementation.
 *
 * The difference between `Promist`s static methods and create functions
 * is that in any completion event, they will always clean up after themselves,
 * clearing the underlying timeouts and/or subscriptions.
 */
export default class Promist<T> {
  /**
   * Creates a `Promist` from a `Promise` or a *sync* or *async* function.
   */
  public static from<T>(
    promise: Promise<T> | (() => Promise<T> | T)
  ): Promist<T> {
    return new this((resolve, reject) => {
      try {
        Promise.resolve(typeof promise === 'function' ? promise() : promise)
          .then(resolve as any)
          .catch(reject);
      } catch (err) {
        return reject(err);
      }
    });
  }
  /**
   * Will wait for `ms` milliseconds before resolving with an empty response.
   */
  public static wait(ms: number): Promist<void> {
    return new this((resolve) => {
      const timeout = setTimeout(resolve, ms);
      return () => clearTimeout(timeout);
    });
  }
  /**
   * Will not resolve until `test` returns `true`, running it every `ms`
   * milliseconds. If `safe` is `true`, it will treat `test` throws and
   * rejections as `false`, instead of rejecting itself.
   */
  public static until(
    test: () => boolean | Promise<boolean>,
    safe?: boolean,
    ms: number = 25
  ): Promist<void> {
    return new this((resolve, reject) => {
      let didComplete = false;
      let timeout: null | NodeJS.Timer = null;

      trunk();

      function reset(): void {
        if (didComplete) return;
        timeout = setTimeout(trunk, ms);
      }
      function trunk(): void {
        try {
          Promise.resolve(test()).then(
            (value) => (value ? resolve() : reset()),
            (reason) => (safe ? reset() : reject(reason))
          );
        } catch (err) {
          safe ? reset() : reject(err);
        }
      }

      return () => {
        didComplete = true;
        if (timeout) clearTimeout(timeout);
      };
    });
  }
  /**
   * Subscribes to an `observable` and resolves/rejects with
   * its first value. By default, it will reject if the observable
   * completes before emitting any values, though this behavior
   * can be controlled via `onComplete`.
   */
  public static subscribe<T>(
    observable: ObservableDefinition<T>,
    onComplete?: PromiseExecutor
  ): Promist<T> {
    return new this((resolve, reject) => {
      let emitted = false;
      const subscription = observable.subscribe({
        next(value) {
          emitted = true;
          resolve(value as any);
        },
        error(error) {
          emitted = true;
          reject(error);
        },
        complete() {
          if (emitted) return;
          if (onComplete) {
            onComplete(resolve, reject);
            until(() => Boolean(subscription), true).then(() =>
              subscription.unsubscribe()
            );
          } else {
            reject(Error(`Source completed without emitting any values`));
          }
        }
      });

      return () => subscription.unsubscribe();
    });
  }
  private [INTERNAL_SYMBOL]: Internal<T>;
  public constructor(executor?: PromistExecutor<T>) {
    let actions: any = null;
    const promise = new Promise<T>((resolve, reject) => {
      actions = { resolve, reject };
    });

    const internal: Internal<T> = {
      promise,
      state: { status: 'pending', value: null, reason: null },
      actions
    };
    this[INTERNAL_SYMBOL] = internal;

    if (executor) {
      const complete = executor(
        this.resolve.bind(this),
        this.reject.bind(this)
      );
      if (complete && typeof complete === 'function') {
        if (internal.state.status === 'pending') this.react.then(complete);
        else complete();
      }
    }
  }
  public get [Symbol.toStringTag](): string {
    return 'Promise';
  }
  public get status(): PromistStatus {
    return this[INTERNAL_SYMBOL].state.status;
  }
  public get value(): T | null {
    return this[INTERNAL_SYMBOL].state.value;
  }
  public get reason(): Error | null {
    return this[INTERNAL_SYMBOL].state.reason;
  }
  public get react(): Promise<void> {
    const internal = this[INTERNAL_SYMBOL];
    return new Promise<void>((resolve) => {
      if (internal.state.status !== 'pending') return resolve();
      const oncomplete = internal.oncomplete;
      internal.oncomplete = oncomplete
        ? () => {
            oncomplete();
            resolve();
          }
        : resolve;
    });
  }
  public then<F = T, R = never>(
    onfulfilled?: ((value: T) => F | Promise<F>) | null,
    onrejected?: ((reason: any) => R | Promise<R>) | null
  ): Promise<F | R> {
    return this[INTERNAL_SYMBOL].promise.then(onfulfilled, onrejected);
  }
  public catch<R = never>(
    onrejected?: ((reason: any) => R | Promise<R>) | null
  ): Promise<T | R> {
    return this.then(undefined, onrejected);
  }
  public finally(fn: (() => void) | undefined | null): Promise<T> {
    return this.then(
      (value) => Promise.resolve(fn && fn()).then(() => value),
      (reason) => Promise.resolve(fn && fn()).then(() => Promise.reject(reason))
    );
  }
  /**
   * Resolves the `Promist` with `value`.
   */
  public resolve(value: T extends RequiredType ? T : T | void): void {
    const { state, actions, oncomplete } = this[INTERNAL_SYMBOL];
    if (state.status !== 'pending') return;

    state.status = 'resolved';
    state.value = value as T;
    actions.resolve(value as T);
    if (oncomplete) oncomplete();
  }
  /**
   * Rejects the `Promist` with `reason`.
   */
  public reject(reason: Error): void {
    const { state, actions, oncomplete } = this[INTERNAL_SYMBOL];
    if (state.status !== 'pending') return;

    state.status = 'rejected';
    state.reason = reason;
    actions.reject(reason);
    if (oncomplete) oncomplete();
  }
  /**
   * Cancels the `Promist`.
   * If it didn't already, it will never resolve nor reject.
   */
  public cancel(): void {
    const { state, oncomplete } = this[INTERNAL_SYMBOL];
    if (state.status !== 'pending') return;

    state.status = 'cancelled';
    if (oncomplete) oncomplete();
  }
  /**
   * Sets a timeout of `ms` milliseconds after which, if the `Promist`
   * hasn't resolved, rejected, or cancelled, it will reject with `reason`.
   */
  public timeout(ms: number, reason?: Error): void {
    const { state } = this[INTERNAL_SYMBOL];
    if (state.status !== 'pending') return;

    const timeout = setTimeout(() => {
      this.reject(reason || Error('Promise timed out'));
    }, ms);
    this.react.then(() => clearTimeout(timeout));
  }
  /**
   * Sets a timeout of `ms` milliseconds after which, if the `Promist`
   * hasn't resolved, rejected, or cancelled, it will resolve
   * by falling back to `value`.
   */
  public fallback(
    ms: number,
    value: T extends RequiredType ? T : T | void
  ): void {
    const { state } = this[INTERNAL_SYMBOL];
    if (state.status !== 'pending') return;

    const timeout = setTimeout(() => this.resolve(value as any), ms);
    this.react.then(() => clearTimeout(timeout));
  }
}
