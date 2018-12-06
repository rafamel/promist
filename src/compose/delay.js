import intercept from '~/helpers/intercept';
import wait from '~/create/wait';

export default function delay(ms, delayRejection = false) {
  const delayer = () => {
    const time = Date.now() - init;
    const remaining = Math.max(0, ms - time);
    return wait(remaining);
  };

  const init = Date.now();
  return (promise) => {
    return intercept(promise, (p) => {
      return p
        .then((val) => delayer().then(() => val))
        .catch((err) => {
          return delayRejection
            ? delayer().then(() => Promise.reject(err))
            : Promise.reject(err);
        });
    });
  };
}
