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
