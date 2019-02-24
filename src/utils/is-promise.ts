export default function isPromise(obj: any): boolean {
  return Boolean(
    obj &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
  );
}
