/**
 * @module compose
 */

import { IPromist, ICancellable, IDeferrable, IStatus, ITimed } from './core';

export function cancellable<A, T>(promise: IPromist<A, T>): ICancellable & A;
export function deferrable<A, T>(promise: IPromist<A, T>): IDeferrable & A;
export function delay(
  ms: number,
  delayRejection?: boolean
): <A, T>(promise: IPromist<A, T>) => A;
export function status<A, T>(promise: IPromist<A, T>): IStatus & A;
export function timed<A, T>(promise: IPromist<A, T>): ITimed & A;
export function timeout(
  ms: number,
  reason?: boolean | Error
): <A, T>(promise: IPromist<A, T>) => ICancellable & IDeferrable & A;
