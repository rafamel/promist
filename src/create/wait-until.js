import wait from './wait';

export default async function waitUntil(testCb, ms = 20) {
  let ans;
  while (!(ans = await testCb())) {
    await wait(ms);
  }

  return ans;
}
