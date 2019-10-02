import { ExtensionKind, Promist, Timed } from '~/types';
import { intercept, mark, extend } from '~/helpers';

export default function timed<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>
): Promist<T, K | 'timed'> {
  if (mark.get(promise, 'timed')) return promise;
  mark.set(promise, 'timed');

  const extended = extend(promise, {
    time: null
  } as Timed);

  const init = Date.now();
  return intercept(extended, (px) => {
    return px
      .then((val) => {
        extended.time = Date.now() - init;
        return val;
      })
      .catch((err) => {
        extended.time = Date.now() - init;
        return Promise.reject(err);
      });
  });
}
