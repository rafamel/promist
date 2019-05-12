import wait from '~/create/wait';
import { asNew, intercept } from '~/helpers';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function delay(ms: number, delayRejection: boolean = false) {
  const init = Date.now();

  const delayer = (): Promise<void> => {
    const time = Date.now() - init;
    const remaining = Math.max(0, ms - time);
    return wait(remaining);
  };

  function trunk<A, T>(promise: A & Promise<T>, create?: false): A & Promise<T>;
  function trunk<T>(promise: Promise<T>, create?: boolean): Promise<T>;
  function trunk<A, T>(promise: A & Promise<T>, create?: boolean): Promise<T> {
    return intercept(asNew(promise, create), (px) => {
      return px
        .then((val) => delayer().then(() => val))
        .catch((err) => {
          return delayRejection
            ? delayer().then(() => Promise.reject(err))
            : Promise.reject(err);
        });
    });
  }

  return trunk;
}
