const defaults = {
  cancellable: false,
  resetable: false,
  deferrable: false,
  timed: false,
  stateful: false
};

export const MARK_SYMBOL = Symbol('mark');

export default {
  set<A, T>(promise: A & Promise<T>, ...as: string[]): A {
    if (!Object.hasOwnProperty.call(promise, MARK_SYMBOL)) {
      Object.assign(promise, { [MARK_SYMBOL]: Object.assign({}, defaults) });
    }

    as.forEach((key) => ((promise as any)[MARK_SYMBOL][key] = true));

    return promise;
  },
  get<T>(promise: Promise<T>, as: string): boolean {
    return Boolean(
      Object.hasOwnProperty.call(promise, MARK_SYMBOL) &&
        (promise as any)[MARK_SYMBOL][as]
    );
  }
};
