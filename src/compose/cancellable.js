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

  return intercept(promise, (p) => {
    return p
      .then((val) => {
        cancellable = false;
        return promise.cancelled ? new Promise(() => {}) : val;
      })
      .catch((err) => {
        cancellable = false;
        return promise.cancelled ? new Promise(() => {}) : Promise.reject(err);
      });
  });
}
