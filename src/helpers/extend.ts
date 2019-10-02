import { Promist, ExtensionType, ExtensionKind, Extend } from '~/types';

export default function extend<
  T,
  E extends ExtensionType<T>,
  K extends ExtensionKind = never
>(
  promise: Promist<T, K> | Promise<T>,
  extension: E
): Promist<T, K | Extend<E>> & E {
  return Object.assign(promise, extension) as Promist<T, K | Extend<E>> & E;
}
