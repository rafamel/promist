import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import { ICancellable } from '~/types';

export default function cancellable<A, T>(promise: A & Promise<T>) {
  const p: A & ICancellable & Promise<T> = promise as any;

  if (mark.get(p, 'cancellable')) return p;
  mark.set(p, 'cancellable');

  let cancellable = true;

  p.cancelled = false;
  p.cancel = function cancel() {
    if (!cancellable) return;
    this.cancelled = true;
  };

  const unfulfilled = new Promise(() => {});
  p.then(() => (cancellable = false)).catch(() => (cancellable = false));
  return intercept(p, (px: Promise<any>) => {
    return px
      .then((val) => (p.cancelled ? unfulfilled : val))
      .catch((err) => (p.cancelled ? unfulfilled : Promise.reject(err)));
  });
}
