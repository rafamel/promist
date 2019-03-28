export default function asNew<T>(p: Promise<T>, create?: boolean): any {
  return create ? p.then((x) => x) : p;
}
