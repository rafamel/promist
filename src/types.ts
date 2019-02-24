export interface ICancellable {
  cancel: () => void;
  cancelled: boolean;
}
export interface IDeferrable {
  resolve: (val?: any) => void;
  reject: (reason: Error) => void;
}

export enum EStatus {
  pending = 'pending',
  resolved = 'resolved',
  rejected = 'rejected'
}

export interface IStatus {
  status: EStatus;
  value: any;
  reason: any;
}
export interface ITimed {
  time: null | number;
}
