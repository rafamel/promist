import { ExtensionKind, Promist } from '~/types';

const INTERCEPT_SYMBOL = Symbol('intercept');
const RESPONSE_SYMBOL = Symbol('response');

export default function intercept<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>,
  interceptFn: (promise: Promise<T>) => Promise<T>
): Promist<T, K> {
  const p: any = promise;
  let intercept: Array<(promise: Promise<T>) => Promise<T>> =
    p[INTERCEPT_SYMBOL];

  if (intercept) {
    p[RESPONSE_SYMBOL] = null;
    intercept.push(interceptFn);
    return promise as Promist<T, K>;
  }

  p[INTERCEPT_SYMBOL] = intercept = [interceptFn];
  const _then = promise.then;
  const run = (): Promise<any> => {
    const res = p[RESPONSE_SYMBOL];
    return (
      res ||
      (p[RESPONSE_SYMBOL] = intercept.reduce(
        (acc: Promise<any>, fn) => fn(acc),
        Promise.resolve(_then.call(promise, (x: any) => x))
      ))
    );
  };

  promise.then = (...args) => run().then(...args);
  promise.catch = (...args) => run().catch(...args);
  if (Object.hasOwnProperty.call(promise, 'finally')) {
    promise.finally = (...args) => run().finally(...args);
  }

  return promise as Promist<T, K>;
}
