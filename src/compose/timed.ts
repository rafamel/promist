import intercept from '~/helpers/intercept';
import mark from '~/helpers/mark';
import { ITimed } from '~/types';

export default function timed<A, T>(promise: A & Promise<T>) {
  const p: A & ITimed & Promise<T> = promise as any;
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
