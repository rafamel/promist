import cancellable from './cancellable';
import deferrable from './deferrable';
import { ICancellable, IDeferrable } from '~/types';
import { asNew, intercept } from '~/helpers';

export default function timeout(ms: number, reason?: boolean | Error) {
  function trunk<A, T>(
    promise: A & Promise<T>,
    create?: false
  ): A & ICancellable & IDeferrable & Promise<T>;
  function trunk<T>(
    promise: Promise<T>,
    create?: boolean
  ): ICancellable & IDeferrable & Promise<T>;
  function trunk<A, T>(promise: A & Promise<T>, create?: boolean) {
    const shouldCancel = reason === undefined || reason === false;
    const p = cancellable(deferrable(asNew(promise, create)));

    let done = false;
    let timeout: any;
    new Promise((resolve) => (timeout = setTimeout(resolve, ms))).then(() => {
      if (done) return;
      if (shouldCancel) return p.cancel();
      if (typeof reason !== 'boolean') return p.reject(reason as Error);
      p.reject(Error('Promise timed out'));
    });

    return intercept(p, (px) => {
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
    });
  }

  return trunk;
}
