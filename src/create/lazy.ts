import intercept from '~/helpers/intercept';
import { PromiseExecutor } from '~/types';

export default lazy;

function lazy<T>(executor: PromiseExecutor<T>): Promise<T> {
  const promise: Promise<T> = new Promise((resolve) => resolve());

  let p: Promise<any>;
  return intercept(promise, () => {
    return p || (p = new Promise(executor as any));
  });
}

lazy.fn = function lazyFn<T>(fn: () => Promise<T> | T): Promise<T> {
  return lazy((resolve, reject) => {
    try {
      Promise.resolve(fn())
        .then(resolve)
        .catch(reject);
    } catch (err) {
      reject(err);
    }
  });
};
