import { extend, intercept, mark } from '~/helpers';
import { Promist, ExtensionKind } from '~/types';

export default function cancellable<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>
): Promist<T, K | 'cancellable'> {
  if (mark.get(promise, 'cancellable')) return promise;
  mark.set(promise, 'cancellable');

  let cancellable = true;
  const extended = extend(promise, {
    cancelled: false as boolean,
    cancel() {
      if (!cancellable) return;
      this.cancelled = true;
    }
  });

  const unfulfilled = new Promise(() => {});
  extended.then(() => (cancellable = false)).catch(() => (cancellable = false));
  return intercept(extended, (px: Promise<any>) => {
    return px
      .then((val) => (extended.cancelled ? unfulfilled : val))
      .catch((err) => (extended.cancelled ? unfulfilled : Promise.reject(err)));
  });
}
