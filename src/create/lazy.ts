import intercept from '~/helpers/intercept';

export type TExecutor = (
  resolve: (val?: any) => void,
  reject: (reason: Error) => void
) => void;

export default function lazy(executor: TExecutor): Promise<any> {
  const promise: Promise<any> = new Promise((resolve) => resolve());

  let p: Promise<any>;
  return intercept(promise, () => {
    return p || (p = new Promise(executor));
  });
}
