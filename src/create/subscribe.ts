import { ObservableDefinition } from '~/types';
import { until } from './until';
import { PromiseExecutor } from '~/classes';

/**
 * Subscribes to an `observable` and resolves/rejects with
 * its first value. By default, it will reject if the observable
 * completes before emitting any values, though this behavior
 * can be controlled via `onComplete`.
 */
export function subscribe<T>(
  observable: ObservableDefinition<T>,
  onComplete?: PromiseExecutor
): Promise<T> {
  return new Promise((resolve, reject) => {
    let emitted = false;
    const subscription = observable.subscribe({
      next(value) {
        resolve(value);
        unsubscribe();
      },
      error(error) {
        reject(error);
        unsubscribe();
      },
      complete() {
        if (emitted) return;
        if (onComplete) onComplete(resolve, reject);
        else reject(Error(`Source completed without emitting any values`));
        unsubscribe();
      }
    });
    function unsubscribe(): void {
      emitted = true;
      until(() => Boolean(subscription), true).then(() =>
        subscription.unsubscribe()
      );
    }
  });
}
