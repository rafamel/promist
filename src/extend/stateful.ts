import { asNew, mark, intercept } from '~/helpers';
import { IStateful } from '~/types';

export default stateful;

function stateful<A, T>(
  promise: A & Promise<T>,
  create?: false
): A & IStateful & Promise<T>;
function stateful<T>(
  promise: Promise<T>,
  create?: boolean
): IStateful & Promise<T>;
function stateful<A, T>(
  promise: A & Promise<T>,
  create?: boolean
): IStateful & Promise<T> {
  const p = asNew(promise, create) as IStateful & Promise<T>;
  if (mark.get(p, 'stateful')) return p;

  mark.set(p, 'stateful');
  p.status = 'pending';
  p.value = null;
  p.reason = null;

  return intercept(p, (px) => {
    return px
      .then((val) => {
        p.status = 'resolved';
        p.value = val;
        return val;
      })
      .catch((err) => {
        p.status = 'rejected';
        p.reason = err;
        return Promise.reject(err);
      });
  });
}
