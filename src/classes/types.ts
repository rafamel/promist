export type PromiseExecutor<T = any> = (
  resolve: (value: T extends RequiredType ? T | Promise<T> : T | void) => void,
  reject: (reason: Error) => void
) => void;

export type PromistExecutor<T = any> = (
  resolve: (value: T extends RequiredType ? T : T | void) => void,
  reject: (reason: Error) => void
) => void | (() => void);

export type PromistStatus = 'pending' | 'resolved' | 'rejected' | 'cancelled';

export type RequiredType = string | number | bigint | boolean | symbol | object;
