/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mark from '~/helpers/mark';
import { Promist, Stateful, Deferrable } from '~/types';
import { extend } from '~/helpers';

export default function deferred<T = any>(): Promist<T, 'deferrable'> {
  const state: Stateful<T> = {
    status: 'pending',
    value: null,
    reason: null
  };

  const exec = fns(state);
  const promise: Promise<T> = new Promise((resolve, reject) => {
    if (state.status === 'resolved') return resolve(state.value as T);
    if (state.status === 'rejected') return reject(state.reason);
    exec.resolve = resolve;
    exec.reject = reject;
  });

  mark.set(promise, 'deferrable');
  return extend(promise, {
    resolve: ((value: T) => exec.resolve(value)) as Deferrable<T>['resolve'],
    reject: (reason: Error) => exec.reject(reason)
  });
}

export function fns<T>(state: Stateful<T>) {
  return {
    resolve(value: T): void {
      state.status = 'resolved';
      state.value = value;
    },
    reject(reason: Error): void {
      state.status = 'rejected';
      state.reason = reason;
    }
  };
}
