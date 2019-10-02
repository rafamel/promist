import mark from '~/helpers/mark';
import { IDeferrable, IStateful } from '~/types';

export default function deferred(): IDeferrable & Promise<any> {
  const state: IStateful = {
    status: 'pending',
    value: null,
    reason: null
  };
  let _resolve = (value: any): void => {
    state.status = 'resolved';
    state.value = value;
  };
  let _reject = (reason: Error): void => {
    state.status = 'rejected';
    state.reason = reason;
  };

  const p = new Promise((resolve, reject) => {
    if (state.status === 'resolved') return resolve(state.value);
    if (state.status === 'rejected') return reject(state.reason);
    _resolve = resolve;
    _reject = reject;
  }) as IDeferrable & Promise<any>;

  mark.set(p, 'deferrable');
  p.resolve = (value: any) => _resolve(value);
  p.reject = (reason: Error) => _reject(reason);
  return p;
}
