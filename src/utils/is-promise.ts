export function isPromise(item: any): item is Promise<unknown> {
  return isPromiseLike(item) && typeof (item as any).catch === 'function';
}

export function isPromiseLike(item: any): item is PromiseLike<unknown> {
  const typeofItem = typeof item;
  return (
    ((typeofItem === 'object' && item !== null) || typeofItem === 'function') &&
    typeof item.then === 'function'
  );
}
