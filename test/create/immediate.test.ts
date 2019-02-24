import immediate from '~/create/immediate';

test(`resolves`, (done) => {
  expect.assertions(1);

  let resolved = false;
  immediate().then(() => (resolved = true));
  setImmediate(() =>
    setImmediate(() => {
      expect(resolved).toBe(true);
      done();
    })
  );
});
