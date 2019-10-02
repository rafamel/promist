import isPromist from '~/utils/is-promist';
import { mark } from '~/helpers';

test(`returns false`, () => {
  for (const kind of mark.list) {
    expect(isPromist(Promise.resolve(), kind)).toBe(false);
  }
});
test(`returns true`, () => {
  for (const kind of mark.list) {
    const promise = mark.set(Promise.resolve(), kind);
    expect(isPromist(promise, kind)).toBe(true);
    for (const inner of mark.list) {
      if (kind === inner) continue;
      expect(isPromist(promise, inner)).toBe(false);
    }
  }
});
