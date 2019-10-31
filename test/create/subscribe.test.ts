import { subscribe } from '~/create';
import { Observable } from 'rxjs';

test(`resolves with next`, async () => {
  const fn = jest.fn();
  const obs = new Observable((self) => {
    self.next('foo');
    return fn;
  });

  await expect(subscribe(obs)).resolves.toBe('foo');
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`rejects with error`, async () => {
  const fn = jest.fn();
  const obs = new Observable((self) => {
    self.error(Error(`foo`));
    return fn;
  });

  await expect(subscribe(obs)).rejects.toThrowError('foo');
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`rejects on complete before emitting a value`, async () => {
  const fn = jest.fn();
  const obs = new Observable((self) => {
    self.complete();
    return fn;
  });

  await expect(subscribe(obs)).rejects.toThrowError();
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`if onComplete is passed, defers to its resolution`, async () => {
  const fn = jest.fn();
  const obs = new Observable((self) => {
    self.complete();
    return fn;
  });

  const p = subscribe(obs, (resolve) => resolve('foo'));
  await expect(p).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`if onComplete is passed, defers to its rejection`, async () => {
  const fn = jest.fn();
  const obs = new Observable((self) => {
    self.complete();
    return fn;
  });

  const p = subscribe(obs, (resolve, reject) => reject(Error('foo')));
  await expect(p).rejects.toThrowError('foo');
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`if onComplete is passed but it has resolved immediately before, it doesn't get called`, async () => {
  const fns = [jest.fn(), jest.fn()];
  const obs = new Observable((self) => {
    self.next();
    self.complete();
    return fns[0];
  });

  const p = subscribe(obs, fns[1]);
  await expect(p).resolves.toBe(undefined);
  expect(fns[0]).toHaveBeenCalledTimes(1);
  expect(fns[1]).not.toHaveBeenCalled();
});
