export default function asNew<T>(p: Promise<T>, create?: boolean): Promise<T> {
  return create ? p.then((x) => x) : p;
}
