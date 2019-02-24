import intercept from '~/helpers/intercept';
import cancellable from './cancellable';
import deferrable from './deferrable';

export default function timeout(ms: number, reason?: boolean | Error) {
  return <A, T>(promise: A & Promise<T>) => {
    const shouldCancel = reason === undefined || reason === false;
    const p = cancellable(deferrable(promise));

    let done = false;
    let timeout: any;
    new Promise((resolve) => (timeout = setTimeout(resolve, ms))).then(() => {
      if (done) return;
      if (shouldCancel) return p.cancel();
      if (typeof reason !== 'boolean') return p.reject(reason as Error);
      p.reject(Error('Promise timed out'));
    });

    return intercept(promise, (px) => {
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
  };
}
