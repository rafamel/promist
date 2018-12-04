import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import deferred from '~/create/deferred';

export default function defer(promise) {
  if (mark.get(promise, 'deferrable')) return promise;

  mark.set(promise, 'deferrable');
  const p = deferred();

  const race = Promise.race(promise, p);
  promise.resolve = p.resolve;
  promise.reject = p.reject;

  return intercept(promise, () => race);
}
