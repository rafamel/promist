/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { pipe } from 'ts-functional-pipe';
import { clone } from '~/helpers';
import _cancellable from './cancellable';
import _deferrable from './deferrable';
import _delay from './delay';
import _stateful from './stateful';
import _timed from './timed';
import _timeout from './timeout';

export const cancellable = pipe(
  clone,
  _cancellable
);
export const deferrable = pipe(
  clone,
  _deferrable
);
export const delay = (ms: number, delayRejection?: boolean) => {
  return pipe(
    clone,
    _delay(ms, delayRejection)
  );
};
export const stateful = pipe(
  clone,
  _stateful
);
export const timed = pipe(
  clone,
  _timed
);
export const timeout = (ms: number, reason?: boolean | Error) => {
  return pipe(
    clone,
    _timeout(ms, reason)
  );
};
