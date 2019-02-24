import intercept from '~/helpers/intercept';
import wait from '~/create/wait';

export default function delay(ms: number, delayRejection: boolean = false) {
  const init = Date.now();

  const delayer = (): Promise<void> => {
    const time = Date.now() - init;
    const remaining = Math.max(0, ms - time);
    return wait(remaining);
  };

  return <A, T>(promise: A & Promise<T>): A & Promise<T> => {
    return intercept(promise, (px) => {
      return px
        .then((val) => delayer().then(() => val))
        .catch((err) => {
          return delayRejection
            ? delayer().then(() => Promise.reject(err))
            : Promise.reject(err);
        });
    });
  };
}
