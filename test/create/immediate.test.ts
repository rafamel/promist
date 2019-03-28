import immediate from '~/create/immediate';

test(`resolves`, (done) => {
  let resolved = false;
  immediate().then(() => (resolved = true));
  setImmediate(() =>
    setImmediate(() => {
      expect(resolved).toBe(true);
      done();
    })
  );
});
