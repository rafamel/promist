export interface AbstractObservable<T> {
  subscribe: (observer: AbstractObserver<T>) => AbstractSubscription;
}

export interface AbstractObserver<T> {
  next: (value: T) => void;
  error: (error: any) => void;
  complete: () => void;
}

export interface AbstractSubscription {
  unsubscribe: () => void;
}
