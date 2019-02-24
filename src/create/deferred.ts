import mark from '~/helpers/mark';
import { IDeferrable } from '~/types';

export default function deferred() {
  let _resolve: any;
  let _reject: any;

  const p: IDeferrable & Promise<any> = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  }) as any;

  mark.set(p, 'deferrable');
  p.resolve = _resolve;
  p.reject = _reject;
  return p;
}
