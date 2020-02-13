export interface ObservableDefinition<T> {
  subscribe(observer: (value: T) => void): SubscriptionDefinition;
  subscribe(observer: ObserverDefinition<T>): SubscriptionDefinition;
}

export interface ObserverDefinition<T> {
  next(value: T): void;
  error(error: any): void;
  complete(): void;
}

export interface SubscriptionDefinition {
  unsubscribe(): void;
}
