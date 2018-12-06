import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';

export default function timed(promise) {
  if (mark.get(promise, 'timed')) return promise;
  mark.set(promise, 'timed');

  promise.time = null;

  const init = Date.now();
  return intercept(promise, (p) => {
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
