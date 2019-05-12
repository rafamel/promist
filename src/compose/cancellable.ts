import { asNew, intercept, mark } from '~/helpers';
import { ICancellable } from '~/types';

export default cancellable;

function cancellable<A, T>(
  promise: A & Promise<T>,
  create?: false
): A & ICancellable & Promise<T>;
function cancellable<T>(
  promise: Promise<T>,
  create?: boolean
): ICancellable & Promise<T>;
function cancellable<A, T>(promise: A & Promise<T>, create?: boolean) {
  const p: A & ICancellable & Promise<T> = asNew(promise, create);

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
