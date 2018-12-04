import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';

export const STATUSES = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

export default function status(promise) {
  if (mark.get(promise, 'status')) return promise;

  mark.set(promise, 'status');
  promise.status = STATUSES.PENDING;
  promise.value = null;
  promise.reason = null;

  return intercept(promise, (p) => {
    return p
      .then((val) => {
        promise.status = STATUSES.RESOLVED;
        promise.value = val;
        return val;
      })
      .catch((err) => {
        promise.status = STATUSES.REJECTED;
        promise.reason = err;
        return Promise.reject(err);
      });
  });
}
