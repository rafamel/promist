export interface Observable<T = any> {
  subscribe(observer: Observer<T>): Subscription;
}

export interface Observer<T = any> {
  next(value: T): void;
  error(error: Error): void;
  complete(): void;
}

export interface Subscription {
  unsubscribe(): void;
}
