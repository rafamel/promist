export default function intercept(promise, interceptFn) {
  const _then = promise.then;

  // TODO make it run just once per promise
  const run = () => interceptFn(Promise.resolve(_then.call(promise, (x) => x)));

  promise.then = (...args) => run().then(...args);
  promise.catch = (...args) => run().catch(...args);
  promise.finally = (...args) => run().finally(...args);

  return promise;
}
