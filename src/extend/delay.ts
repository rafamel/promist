/* eslint-disable @typescript-eslint/explicit-function-return-type */
import wait from '~/create/wait';
import { intercept } from '~/helpers';
import { Promist, ExtensionKind } from '~/types';

export default function delay(ms: number, delayRejection: boolean = false) {
  const init = Date.now();

  const delayer = (): Promise<void> => {
    const time = Date.now() - init;
    const remaining = Math.max(0, ms - time);
    return wait(remaining);
  };

  return function trunk<T, K extends ExtensionKind = never>(
    promise: Promist<T, K> | Promise<T>
  ): Promist<T, K> {
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
