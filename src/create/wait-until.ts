import wait from './wait';

export default function waitUntil(
  testCb: () => boolean | Promise<boolean>,
  ms: number = 20
): Promise<void> {
  const callCb = (): Promise<any> => {
    return Promise.resolve(testCb()).then((ans) => {
      return ans || wait(ms).then(() => callCb());
    });
  };

  return callCb().then(() => {});
}
