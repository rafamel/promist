import intercept from '~/helpers/intercept';
import cancellable from './cancellable';
import deferrable from './deferrable';

export default function timeout(ms, reason) {
  return (promise) => {
    const shouldCancel = reason === undefined || reason === false;
    promise = shouldCancel ? cancellable(promise) : deferrable(promise);

    let done = false;
    let timeout;
    new Promise((resolve) => (timeout = setTimeout(resolve, ms))).then(() => {
      if (done) return;
      if (shouldCancel) return promise.cancel();
      if (typeof reason !== 'boolean') return promise.reject(reason);
      promise.reject(Error('Promise timed out'));
    });

    return intercept(promise, (p) => {
      return p
        .then((val) => {
          done = true;
          clearTimeout(timeout);
          return val;
        })
        .catch((err) => {
          done = true;
          clearTimeout(timeout);
          return Promise.reject(err);
        });
    });
  };
}
