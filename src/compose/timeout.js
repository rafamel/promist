import intercept from '~/helpers/intercept';
import wait from '~/create/wait';
import cancellable from './cancellable';
import deferrable from './deferrable';

export default function timeout(ms, reason) {
  return (promise) => {
    promise = reason ? deferrable(promise) : cancellable(promise);

    return intercept(promise, (p) => {
      let done = false;
      wait(ms).then(() => !done && (reason ? p.reject(reason) : p.cancel()));

      return p
        .then((val) => (done = true) && val)
        .catch((err) => (done = true) && Promise.reject(err));
    });
  };
}
