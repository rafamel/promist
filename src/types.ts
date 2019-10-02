// General
export type Promist<T, K extends ExtensionKind> = Promise<T> &
  ('cancellable' extends K ? Cancellable : {}) &
  ('deferrable' extends K ? Deferrable<T> : {}) &
  ('stateful' extends K ? Stateful<T> : {}) &
  ('timed' extends K ? Timed : {});

export type Extend<E extends ExtensionType<any>> =
  | (E extends Cancellable ? 'cancellable' : never)
  | (E extends Deferrable<any> ? 'deferrable' : never)
  | (E extends Stateful<any> ? 'stateful' : never)
  | (E extends Timed ? 'timed' : never);

export type ExtensionKind = 'cancellable' | 'deferrable' | 'stateful' | 'timed';
export type ExtensionType<T> =
  | Cancellable
  | Deferrable<T>
  | Stateful<T>
  | Timed;

// Extensions
export interface Cancellable {
  cancel: () => void;
  cancelled: boolean;
}

export interface Deferrable<T> {
  resolve: unknown | any | void | undefined extends T
    ? ((value?: T) => void)
    : ((value: T) => void);
  reject: (reason: Error) => void;
}

export interface Stateful<T> {
  status: 'pending' | 'resolved' | 'rejected';
  value: T | null;
  reason: Error | null;
}

export interface Timed {
  time: null | number;
}

// Parameters
export type PromiseExecutor<T = any> = (
  resolve: unknown | any | void | undefined extends T
    ? ((value?: T) => void)
    : ((value: T) => void),
  reject: (reason: Error) => void
) => void;
