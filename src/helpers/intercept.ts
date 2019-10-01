const INTERCEPT_SYMBOL = Symbol('intercept');
const RESPONSE_SYMBOL = Symbol('response');

export default function intercept<A, T>(
  promise: A & Promise<T>,
  interceptFn: (promise: Promise<T>) => Promise<T>
): A {
  const p: any = promise;
  let intercept: Array<(promise: Promise<T>) => Promise<T>> =
    p[INTERCEPT_SYMBOL];

  if (intercept) {
    p[RESPONSE_SYMBOL] = null;
    intercept.push(interceptFn);
    return promise;
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

  return promise;
}
