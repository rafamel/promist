import { mark, intercept, extend } from '~/helpers';
import { ExtensionKind, Promist, Stateful } from '~/types';

export default function stateful<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>
): Promist<T, K | 'stateful'> {
  if (mark.get(promise, 'stateful')) return promise;
  mark.set(promise, 'stateful');

  const extended = extend(promise, {
    status: 'pending',
    value: null,
    reason: null
  } as Stateful<T>);

  return intercept(extended, (px) => {
    return px
      .then((val) => {
        extended.status = 'resolved';
        extended.value = val;
        return val;
      })
      .catch((err) => {
        extended.status = 'rejected';
        extended.reason = err;
        return Promise.reject(err);
      });
  });
}
