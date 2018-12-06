import compose from '~/utils/compose';

const INTERCEPT_SYMBOL = Symbol('intercept');
const RESPONSE_SYMBOL = Symbol('response');

export default function intercept(promise, interceptFn) {
  let intercept = promise[INTERCEPT_SYMBOL];

  if (intercept) {
    promise[RESPONSE_SYMBOL] = null;
    intercept.push(interceptFn);
    return promise;
  }

  intercept = [interceptFn];
  promise[INTERCEPT_SYMBOL] = intercept;
  const _then = promise.then;
  const run = () => {
    const res = promise[RESPONSE_SYMBOL];
    return (
      res ||
      (promise[RESPONSE_SYMBOL] = compose(...intercept)(
        Promise.resolve(_then.call(promise, (x) => x))
      ))
    );
  };

  promise.then = (...args) => run().then(...args);
  promise.catch = (...args) => run().catch(...args);
  promise.finally = (...args) => run().finally(...args);

  return promise;
}
