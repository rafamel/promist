import * as promist from '~/index';
import * as utils from '~/utils';
import * as compose from '~/compose';
import * as create from '~/create';
import series from '~/series';
import parallel from '~/parallel';

test(`exports all public`, () => {
  expect(promist).toEqual({
    ...utils,
    ...compose,
    ...create,
    parallel,
    series
  });
});
