import { intercept, mark, extend } from '~/helpers';
import deferred from '~/create/deferred';
import { ExtensionKind, Promist, Deferrable } from '~/types';

export default function deferrable<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>
): Promist<T, K | 'deferrable'> {
  if (mark.get(promise, 'deferrable')) return promise;
  mark.set(promise, 'deferrable');

  const px = deferred();

  const extended = extend(promise, {
    resolve: px.resolve as Deferrable<T>['resolve'],
    reject: px.reject
  });

  return intercept(extended, (py) => {
    py.then((val) => px.resolve(val)).catch((reason) => px.reject(reason));
    return px;
  });
}
