import { expect, test } from 'vitest';
import { AbortController } from 'abort-controller';

import { timeout } from '../../src/creation';
import { CancellablePromise } from '../../src/classes';

test(`returns CancellablePromise`, () => {
  const p = timeout(0, () => () => undefined);
  expect(p).toBeInstanceOf(CancellablePromise);
});
test(`resolves value if before timeout (sync)`, async () => {
  const p = timeout(0, (resolve) => {
    resolve('foo');
    return () => resolve('bar');
  });
  await expect(p).resolves.toBe('foo');
});
test(`resolves value if before timeout (async)`, async () => {
  const p = timeout(200, (resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });
  await expect(p).resolves.toBe('foo');
});
test(`resolves fallback if after timeout`, async () => {
  const p = timeout(100, (resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 200);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });
  await expect(p).resolves.toBe('bar');
});
test(`resolves fallback with explicit cancel`, async () => {
  const p = timeout(200, (resolve) => {
    const timeout = setTimeout(() => resolve('foo'), 100);
    return () => {
      clearTimeout(timeout);
      resolve('bar');
    };
  });
  p.cancel();
  await expect(p).resolves.toBe('bar');
});
test(`resolves fallback with explicit signal abort`, async () => {
  const controller = new AbortController();
  const p = timeout(
    { delay: 200, abortSignal: controller.signal },
    (resolve) => {
      const timeout = setTimeout(() => resolve('foo'), 100);
      return () => {
        clearTimeout(timeout);
        resolve('bar');
      };
    }
  );
  controller.abort();
  await expect(p).resolves.toBe('bar');
});
