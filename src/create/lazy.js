import intercept from '~/helpers/intercept';

export default function lazy(executor) {
  const promise = new Promise((resolve) => resolve());

  let p;
  return intercept(promise, () => {
    return p || (p = new Promise(executor));
  });
}
