export default function isPromise(value: any): value is Promise<any> {
  return Boolean(
    value &&
      (typeof value === 'object' || typeof value === 'function') &&
      typeof value.then === 'function'
  );
}
