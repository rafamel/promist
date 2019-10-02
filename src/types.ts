export interface ICancellable {
  cancel: () => void;
  cancelled: boolean;
}
export interface IDeferrable {
  resolve: (val?: any) => void;
  reject: (reason: Error) => void;
}

export interface IStateful {
  status: 'pending' | 'resolved' | 'rejected';
  value: any;
  reason: any;
}
export interface ITimed {
  time: null | number;
}
