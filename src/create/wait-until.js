import wait from './wait';

export default function waitUntil(testCb, ms = 20) {
  const callCb = () => {
    return Promise.resolve(testCb()).then((ans) => {
      return ans || wait(ms).then(() => callCb());
    });
  };

  return callCb();
}
