import { asNew, intercept, mark } from '~/helpers';
import deferred from '~/create/deferred';
import { IDeferrable } from '~/types';

export default deferrable;

function deferrable<A, T>(
  promise: A & Promise<T>,
  create?: false
): A & IDeferrable & Promise<T>;
function deferrable<T>(
  promise: Promise<T>,
  create?: boolean
): IDeferrable & Promise<T>;
function deferrable<A, T>(
  promise: A & Promise<T>,
  create?: boolean
): IDeferrable & Promise<T> {
  const p = asNew(promise, create) as IDeferrable & Promise<T>;

  if (mark.get(p, 'deferrable')) return p;

  mark.set(p, 'deferrable');
  const px = deferred();

  p.resolve = px.resolve;
  p.reject = px.reject;

  return intercept(p, (py) => {
    py.then((val) => px.resolve(val)).catch((reason) => px.reject(reason));
    return px;
  });
}
