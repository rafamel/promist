import { ExtensionKind, Promist } from '~/types';
import { mark } from '~/helpers';

export default function isPromist<T, K extends ExtensionKind>(
  promise: Promise<T>,
  kind: K
): promise is Promist<T, K> {
  return mark.get(promise, kind);
}
