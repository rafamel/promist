export default function immediate() {
  return new Promise((resolve) => setImmediate(resolve));
}
