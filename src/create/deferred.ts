import mark from '~/helpers/mark';
import { Promist, Stateful, Deferrable } from '~/types';
import { extend } from '~/helpers';

export default function deferred<T = any>(): Promist<T, 'deferrable'> {
  const state: Stateful<T> = {
    status: 'pending',
    value: null,
    reason: null
  };
  let _resolve = (value: T): void => {
    state.status = 'resolved';
    state.value = value;
  };
  let _reject = (reason: Error): void => {
    state.status = 'rejected';
    state.reason = reason;
  };
  const promise: Promise<T> = new Promise((resolve, reject) => {
    if (state.status === 'resolved') return resolve(state.value as T);
    if (state.status === 'rejected') return reject(state.reason);
    _resolve = resolve;
    _reject = reject;
  });

  mark.set(promise, 'deferrable');
  return extend(promise, {
    resolve: ((value: T) => _resolve(value)) as Deferrable<T>['resolve'],
    reject: (reason: Error) => _reject(reason)
  });
}
