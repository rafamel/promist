import { ITimed } from '~/types';
import { asNew, intercept, mark } from '~/helpers';

export default timed;

function timed<A, T>(
  promise: A & Promise<T>,
  create?: false
): A & ITimed & Promise<T>;
function timed<T>(promise: Promise<T>, create?: boolean): ITimed & Promise<T>;
function timed<A, T>(
  promise: A & Promise<T>,
  create?: boolean
): ITimed & Promise<T> {
  const p = asNew(promise, create) as ITimed & Promise<T>;
  if (mark.get(p, 'timed')) return p;
  mark.set(p, 'timed');

  p.time = null;

  const init = Date.now();
  return intercept(p, (px) => {
    return px
      .then((val) => {
        p.time = Date.now() - init;
        return val;
      })
      .catch((err) => {
        p.time = Date.now() - init;
        return Promise.reject(err);
      });
  });
}
