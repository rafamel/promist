import lazy from '~/create/lazy';

test(`Executor is not run until then is called`, () => {
  let run = false;
  const p = lazy((resolve) => (run = true) && resolve());

  expect(run).toBe(false);
  p.then();
  expect(run).toBe(true);
});
test(`Executor is not run until catch is called`, () => {
  let run = false;
  const p = lazy((resolve) => (run = true) && resolve());

  expect(run).toBe(false);
  p.catch();
  expect(run).toBe(true);
});
test(`Resolves`, async () => {
  const p = lazy((resolve) => resolve(1));
  await expect(p).resolves.toBe(1);
});
test(`Rejects`, async () => {
  // @ts-ignore
  const p = lazy((_, reject) => reject(1));
  await expect(p).rejects.toBe(1);
});
test(`Executor doesn't run twice`, async () => {
  let run = 0;
  const p = lazy((resolve) => {
    run++;
    resolve(1);
  });

  expect(run).toBe(0);
  p.then();
  expect(run).toBe(1);
  await expect(p).resolves.toBe(1);
  expect(run).toBe(1);
  p.then();
  expect(run).toBe(1);
});
