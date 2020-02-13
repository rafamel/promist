export type PromistStatus = 'pending' | 'resolved' | 'rejected' | 'cancelled';

export type PromistExecutor<T = any> = (
  resolve: (value: ValueType<T>) => void,
  reject: (reason: Error) => void
) => void | (() => void);

export type PromiseExecutor<T = any> = (
  resolve: (
    value: T | (T extends RequiredType ? T | Promise<T> : T | void)
  ) => void,
  reject: (reason: Error) => void
) => void;

export type ValueType<T> = T | (T extends RequiredType ? T : T | void);

export type RequiredType =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | object
  | null;
