import intercept from '~/helpers/intercept';
import wait from '~/create/wait';
import cancellable from './cancellable';
import deferrable from './deferrable';

export default function timeout(ms, reason) {
  return (promise) => {
    const shouldCancel = reason === undefined || reason === false;
    promise = shouldCancel ? cancellable(promise) : deferrable(promise);

    let done = false;
    wait(ms).then(() => {
      if (done) return;
      if (shouldCancel) return promise.cancel();
      if (typeof reason !== 'boolean') return promise.reject(reason);
      promise.reject(Error('Promise timed out'));
    });

    return intercept(promise, (p) => {
      return p
        .then((val) => (done = true) && val)
        .catch((err) => (done = true) && Promise.reject(err));
    });
  };
}
