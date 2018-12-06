import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import deferred from '~/create/deferred';

export default function defer(promise) {
  if (mark.get(promise, 'deferrable')) return promise;

  mark.set(promise, 'deferrable');
  const p = deferred();

  promise.resolve = p.resolve;
  promise.reject = p.reject;

  return intercept(promise, (promise) => {
    promise.then((val) => p.resolve(val)).catch((reason) => p.reject(reason));
    return p;
  });
}
