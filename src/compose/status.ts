import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import { IStatus, EStatus } from '~/types';

export default function status<A, T>(promise: A & Promise<T>) {
  const p: A & IStatus & Promise<T> = promise as any;
  if (mark.get(p, 'status')) return p;

  mark.set(p, 'status');
  p.status = EStatus.pending;
  p.value = null;
  p.reason = null;

  return intercept(p, (px) => {
    return px
      .then((val) => {
        p.status = EStatus.resolved;
        p.value = val;
        return val;
      })
      .catch((err) => {
        p.status = EStatus.rejected;
        p.reason = err;
        return Promise.reject(err);
      });
  });
}
