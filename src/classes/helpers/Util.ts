import { type NullaryFn, TypeGuard, type UnaryFn } from 'type-core';

export class Util {
  static noop(): void {
    return undefined;
  }
  static operate<U, US = U, UF = never>(
    cb: NullaryFn<U | PromiseLike<U>>,
    success?: UnaryFn<U, US> | null,
    failure?: UnaryFn<Error | unknown, UF> | null
  ): US | UF | PromiseLike<US | UF> {
    let response: U | PromiseLike<U>;
    try {
      response = cb();
    } catch (err) {
      if (failure) return failure(err);
      else throw err;
    }

    if (TypeGuard.isPromiseLike(response)) {
      return success || failure
        ? response.then(success, failure)
        : (response as Promise<any>);
    } else {
      return success ? success(response) : (response as any);
    }
  }
}
