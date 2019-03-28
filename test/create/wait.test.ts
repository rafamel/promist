import wait from '~/create/wait';

test(`waits`, (done) => {
  let resolved = false;
  wait(100).then(() => (resolved = true));

  setTimeout(() => expect(resolved).toBe(false), 90);
  setTimeout(() => {
    expect(resolved).toBe(true);
    done();
  }, 110);
});
