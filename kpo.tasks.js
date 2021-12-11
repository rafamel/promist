const {
  recreate,
  context,
  create,
  series,
  lift,
  exec,
  catches
} = require('kpo');
const riseup = require('./riseup.config');

const tasks = {
  node: riseup.node,
  build: riseup.build,
  tarball: riseup.tarball,
  docs: riseup.docs,
  fix: riseup.fix,
  lint: series(riseup.lintmd, riseup.lint),
  test: riseup.test,
  commit: riseup.commit,
  release: context({ args: ['--no-verify'] }, riseup.release),
  distribute: riseup.distribute,
  validate: series(
    create(() => tasks.lint),
    create(() => tasks.test),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepare: catches(null, exec('simple-git-hooks')),
  version: series(
    create(() => tasks.validate),
    create(() => tasks.build),
    create(() => tasks.docs)
  )
};

module.exports = recreate({ announce: true }, tasks);
