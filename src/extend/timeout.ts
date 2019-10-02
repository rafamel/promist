/* eslint-disable @typescript-eslint/explicit-function-return-type */
import cancellable from './cancellable';
import deferrable from './deferrable';
import { Promist, ExtensionKind } from '~/types';
import { intercept } from '~/helpers';

export default function timeout(ms: number, reason?: boolean | Error) {
  return function trunk<T, K extends ExtensionKind = never>(
    promise: Promist<T, K> | Promise<T>
  ): Promist<T, K | 'cancellable' | 'deferrable'> {
    const shouldCancel = reason === undefined || reason === false;
    const extended = cancellable(deferrable(promise as Promise<T>));

    let done = false;
    let timeout: any;
    new Promise((resolve) => (timeout = setTimeout(resolve, ms))).then(() => {
      if (done) return;
      if (shouldCancel) return extended.cancel();
      if (typeof reason !== 'boolean') return extended.reject(reason as Error);
      extended.reject(Error('Promise timed out'));
    });

    return intercept(
      extended as Promist<T, K | 'cancellable' | 'deferrable'>,
      (px) => {
        return px
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
      }
    );
  };
}
