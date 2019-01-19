/**
 * @module core
 */

type IPromist<A, T> = A & (Promise<T> | PromiseLike<T>);

export interface ICancellable {
  cancel: () => void;
  cancelled: boolean;
}
export interface IDeferrable {
  resolve: (val: any) => void;
  reject: (val: any) => void;
}
export interface IStatus {
  status: 'pending' | 'resolved' | 'rejected';
  value: any;
  reason: any;
}
export interface ITimed {
  time: null | number;
}
