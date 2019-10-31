import { PromiseExecutor, RequiredType } from './types';
import Promist from './Promist';

const INTERNAL_SYMBOL = Symbol('internal');

export interface Internal {
  executed: boolean;
  execute: () => void;
  onstart?: () => void;
}

/**
 * `LazyPromist`s don't run their constructor `executor` until
 * after they've been explicitly expected to resolve
 * by a `then`, `catch`, or `finally` call.
 */
export default class LazyPromist<T> extends Promist<T> {
  private [INTERNAL_SYMBOL]: Internal;
  public constructor(executor: PromiseExecutor) {
    super();

    let executed = false;
    this[INTERNAL_SYMBOL] = {
      get executed() {
        return executed;
      },
      execute: () => {
        if (executed || this.status !== 'pending') return;
        executed = true;
        const complete = executor(
          this.resolve.bind(this),
          this.reject.bind(this)
        );
        const { onstart } = this[INTERNAL_SYMBOL];
        if (onstart) onstart();
        if (complete && typeof complete === 'function') {
          if (this.status === 'pending') this.react.then(complete);
          else complete();
        }
      }
    };
  }
  public then<F = T, R = never>(
    onfulfilled?: ((value: T) => F | Promise<F>) | null,
    onrejected?: ((reason: any) => R | Promise<R>) | null
  ): Promise<F | R> {
    this[INTERNAL_SYMBOL].execute();
    return super.then(onfulfilled, onrejected);
  }
  public timeout(ms: number, reason?: Error): void {
    const { executed, onstart } = this[INTERNAL_SYMBOL];
    if (executed) {
      super.timeout(ms, reason);
    } else {
      this[INTERNAL_SYMBOL].onstart = onstart
        ? () => {
            onstart();
            super.timeout(ms, reason);
          }
        : () => super.timeout(ms, reason);
    }
  }
  public fallback(
    ms: number,
    value: T extends RequiredType ? T : T | void
  ): void {
    const { executed, onstart } = this[INTERNAL_SYMBOL];
    if (executed) {
      super.fallback(ms, value);
    } else {
      this[INTERNAL_SYMBOL].onstart = onstart
        ? () => {
            onstart();
            super.fallback(ms, value);
          }
        : () => super.fallback(ms, value);
    }
  }
}
