import { Promist, ExtensionKind } from '~/types';
import mark from '~/helpers/mark';
import cancellable from '~/extend/cancellable';
import deferrable from '~/extend/deferrable';
import stateful from '~/extend/stateful';
import timed from '~/extend/timed';

export default function clone<T, K extends ExtensionKind = never>(
  promise: Promist<T, K> | Promise<T>
): Promist<T, K> {
  let clone = promise.then((x) => x);

  if (mark.get(promise, 'cancellable')) clone = cancellable(clone);
  if (mark.get(promise, 'deferrable')) clone = deferrable(clone);
  if (mark.get(promise, 'stateful')) clone = stateful(clone);
  if (mark.get(promise, 'timed')) clone = timed(clone);

  return clone as Promist<T, K>;
}
