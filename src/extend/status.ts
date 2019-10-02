import { asNew, mark, intercept } from '~/helpers';
import { IStatus } from '~/types';

export default status;

function status<A, T>(
  promise: A & Promise<T>,
  create?: false
): A & IStatus & Promise<T>;
function status<T>(promise: Promise<T>, create?: boolean): IStatus & Promise<T>;
function status<A, T>(
  promise: A & Promise<T>,
  create?: boolean
): IStatus & Promise<T> {
  const p = asNew(promise, create) as IStatus & Promise<T>;
  if (mark.get(p, 'status')) return p;

  mark.set(p, 'status');
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
