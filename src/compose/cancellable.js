import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';

export default function cancellable(promise) {
  if (mark.get(promise, 'cancellable')) return promise;
  mark.set(promise, 'cancellable');

  let cancellable = true;
  promise.cancelled = false;

  promise.cancel = function cancel() {
    if (!cancellable) return;
    promise.cancelled = true;
  };

  const unfulfilled = new Promise(() => {});
  promise.then(() => (cancellable = false)).catch(() => (cancellable = false));
  return intercept(promise, (p) => {
    return p
      .then((val) => (promise.cancelled ? unfulfilled : val))
      .catch((err) => (promise.cancelled ? unfulfilled : Promise.reject(err)));
  });
}
