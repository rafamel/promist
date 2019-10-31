import { AbstractObservable } from '~/types';
import { until } from './until';

/**
 * Subscribe to an observable and resolve/reject with its first value.
 * It will reject it the observable completes before emitting any values.
 */
export function subscribe<T>(observable: AbstractObservable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: (value) => {
        resolve(value);
        unsubscribe();
      },
      error: (error) => {
        reject(error);
        unsubscribe();
      },
      complete: () => {
        reject(Error(`Source completed without emitting any values`));
        unsubscribe();
      }
    });
    function unsubscribe(): void {
      until(() => Boolean(subscription), true).then(() =>
        subscription.unsubscribe()
      );
    }
  });
}
