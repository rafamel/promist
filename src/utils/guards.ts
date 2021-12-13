import { TypeGuard } from 'type-core';

export function isPromise(item: any): item is Promise<unknown> {
  return TypeGuard.isPromise(item);
}

export function isPromiseLike(item: any): item is PromiseLike<unknown> {
  return TypeGuard.isPromiseLike(item);
}
