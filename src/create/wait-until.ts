import wait from './wait';

export default function waitUntil(
  test: () => boolean | Promise<boolean>,
  ms: number = 20
): Promise<void> {
  const callCb = (): Promise<void> => {
    try {
      return Promise.resolve(test()).then((ans) => {
        return ans ? undefined : wait(ms).then(() => callCb());
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return callCb();
}
