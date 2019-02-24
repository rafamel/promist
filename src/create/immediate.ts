export default function immediate(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}
