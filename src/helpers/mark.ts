import { Promist, ExtensionKind } from '~/types';

export const MARK_SYMBOL = Symbol('mark');

const defaults: { [P in ExtensionKind]: boolean } = {
  cancellable: false,
  deferrable: false,
  timed: false,
  stateful: false
};

export default {
  list: Object.keys(defaults) as ExtensionKind[],
  set<T, X extends ExtensionKind, K extends ExtensionKind = never>(
    promise: Promist<T, K> | Promise<T>,
    kind: X
  ): Promist<T, K> {
    if (!Object.hasOwnProperty.call(promise, MARK_SYMBOL)) {
      Object.assign(promise, { [MARK_SYMBOL]: Object.assign({}, defaults) });
    }

    (promise as any)[MARK_SYMBOL][kind] = true;
    return promise as Promist<T, K>;
  },
  get<T, X extends ExtensionKind, K extends ExtensionKind = never>(
    promise: Promist<T, K> | Promise<T>,
    kind: X
  ): promise is Promist<T, K | X> {
    return Boolean(
      Object.hasOwnProperty.call(promise, MARK_SYMBOL) &&
        (promise as any)[MARK_SYMBOL][kind]
    );
  }
};
