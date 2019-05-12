import { asNew } from '~/helpers';

export default function compose(
  ...fns: Array<<T>(promise: Promise<T>, create?: boolean) => Promise<T>>
): <T>(promise: Promise<T>, create?: boolean) => Promise<T> {
  const fn = trunk(...fns);
  return (promise, create) => fn(asNew(promise, create));
}

export function trunk(...fns: Array<(value: any) => any>): (value: any) => any {
  if (fns.length === 0) return (arg: any) => arg;
  if (fns.length === 1) return fns[0];

  return fns.reduce((a, b) => (...args) => a(b(...args)));
}
