import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';

export default function timed(promise) {
  if (mark.get(promise, 'timed')) return promise;
  mark.set(promise, 'timed');

  promise.time = null;

  let init;
  return intercept(promise, (p) => {
    init = Date.now();

    return p
      .then((val) => {
        promise.time = Date.now() - init;
        return val;
      })
      .catch((err) => {
        promise.time = Date.now() - init;
        return Promise.reject(err);
      });
  });
}
