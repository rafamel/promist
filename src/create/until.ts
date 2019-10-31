/**
 * Will not resolve until `test` returns `true`, running it every `ms`
 * milliseconds. If `safe` is `true`, it will treat `test` throws and
 * rejections as `false`, instead of rejecting itself.
 */
export function until(
  test: () => boolean | Promise<boolean>,
  safe?: boolean,
  ms: number = 25
): Promise<void> {
  return new Promise((resolve, reject) => {
    const reset = (): any => setTimeout(trunk, ms);

    trunk();
    function trunk(): void {
      try {
        Promise.resolve(test()).then(
          (value) => (value ? resolve() : reset()),
          (reason) => (safe ? reset() : reject(reason))
        );
      } catch (err) {
        safe ? reset() : reject(err);
      }
    }
  });
}
