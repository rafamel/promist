import intercept from '~/helpers/intercept';
import wait from '~/create/wait';
import timed from './timed';

export default function delay(ms, delayRejection = false) {
  return (promise) => {
    promise = timed(promise);

    const delayer = async (p) => {
      const remaining = p.time ? ms - p.time : 0;
      if (remaining > 0) await wait(remaining);
    };

    return intercept(promise, (p) => {
      return p
        .then((val) => delayer(p).then(val))
        .catch((err) => {
          return delayRejection
            ? delayer(p).then(() => Promise.reject(err))
            : Promise.reject(err);
        });
    });
  };
}
