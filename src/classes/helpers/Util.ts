import { type Callable, TypeGuard } from 'type-core';

export class Util {
  static noop(): void {
    return undefined;
  }
  static operate<U, US = U, UF = never>(
    cb: Callable<void, U | PromiseLike<U>>,
    success?: Callable<U, US> | null,
    failure?: Callable<Error | unknown, UF> | null
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
