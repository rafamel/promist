import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import deferred from '~/create/deferred';
import { IDeferrable } from '~/types';

export default function defer<A, T>(promise: A & Promise<T>) {
  const p: A & IDeferrable & Promise<T> = promise as any;

  if (mark.get(p, 'deferrable')) return p;

  mark.set(promise, 'deferrable');
  const px = deferred();

  p.resolve = px.resolve;
  p.reject = px.reject;

  return intercept(p, (py) => {
    py.then((val) => px.resolve(val)).catch((reason) => px.reject(reason));
    return px;
  });
}
