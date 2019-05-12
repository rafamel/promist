import mark from '~/helpers/mark';
import { IDeferrable } from '~/types';

export default function deferred(): IDeferrable & Promise<any> {
  let _resolve: any;
  let _reject: any;

  const p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  }) as IDeferrable & Promise<any>;

  mark.set(p, 'deferrable');
  p.resolve = _resolve;
  p.reject = _reject;
  return p;
}
