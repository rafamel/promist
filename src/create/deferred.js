import mark from '~/helpers/mark';

export default function deferred() {
  let _resolve, _reject;

  const p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  mark.set(p, 'deferrable');

  p.resolve = _resolve;
  p.reject = _reject;
  return p;
}
