const getDefaults = () => ({
  cancellable: false,
  resetable: false,
  deferrable: false,
  timed: false,
  status: false
});

export const MARK_SYMBOL = Symbol('mark');
export default {
  set(promise, ...as) {
    if (!promise[MARK_SYMBOL]) promise[MARK_SYMBOL] = getDefaults();

    as.forEach((key) => (promise[MARK_SYMBOL][key] = true));

    return promise;
  },
  get(promise, as) {
    return !!(promise[MARK_SYMBOL] && promise[MARK_SYMBOL][as]);
  }
};
