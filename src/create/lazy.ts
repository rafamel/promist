import intercept from '~/helpers/intercept';

export type TExecutor = (
  resolve: (val?: any) => void,
  reject: (reason: Error) => void
) => void;

export default lazy;

function lazy(executor: TExecutor): Promise<any> {
  const promise: Promise<any> = new Promise((resolve) => resolve());

  let p: Promise<any>;
  return intercept(promise, () => {
    return p || (p = new Promise(executor));
  });
}

lazy.fn = function lazyFn<T>(fn: () => Promise<T> | T): Promise<T> {
  return lazy((resolve, reject) => {
    try {
      return Promise.resolve(fn())
        .then(resolve)
        .catch(reject);
    } catch (err) {
      reject(err);
    }
  });
};
