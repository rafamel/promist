import { expect, test, vi } from 'vitest';

import { wait } from '../../src';
import { SyncPromise } from '../../src/classes';

test(`SyncPromise.prototype[Symbol.toStringTag]: is "SyncPromise"`, () => {
  const p = new SyncPromise(() => undefined);
  expect(p[Symbol.toStringTag]).toBe('SyncPromise');
});
test(`SyncPromise.prototype.consume: returns value when resolve is called synchronously`, async () => {
  const p = new SyncPromise((resolve) => resolve('foo'));

  expect(p.consume()).toBe('foo');
  await expect(p).resolves.toBe('foo');
});
test(`SyncPromise.prototype.consume: throws when reject is called synchronously`, async () => {
  const err = new Error('...');
  const p = new SyncPromise((_, reject) => reject(err));

  expect(() => p.consume()).toThrowError(err);
  await expect(p).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.consume: returns resolving promise when it has not been resolved yet`, async () => {
  const p = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 100);
  });

  expect(p.consume()).toBeInstanceOf(Promise);
  await expect(p.consume()).resolves.toBe('foo');
  await expect(p).resolves.toBe('foo');
});
test(`SyncPromise.prototype.consume: returns rejecting promise when it has not been rejected yet`, async () => {
  const err = new Error('...');
  const p = new SyncPromise((_, reject) => {
    setTimeout(() => reject(err), 100);
  });

  const r = p.consume();
  expect(r).toBeInstanceOf(Promise);
  await expect(r).rejects.toThrowError(err);
  await expect(p).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.consume: returns value after resolve has been called`, async () => {
  const p = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 100);
  });

  await expect(p).resolves.toBe('foo');
  expect(p.consume()).toBe('foo');
});
test(`SyncPromise.prototype.consume: throws after reject has been called`, async () => {
  const err = new Error('...');
  const p = new SyncPromise((_, reject) => {
    setTimeout(() => reject(err), 100);
  });

  await expect(p).rejects.toThrowError(err);
  expect(() => p.consume()).toThrowError(err);
});
test(`SyncPromise.prototype.consume: returns resolving promise when resolve is called with a resolving promise`, async () => {
  const p = new SyncPromise((resolve) => {
    resolve(Promise.resolve('foo'));
  });

  expect(p.consume()).toBeInstanceOf(Promise);
  await expect(p.consume()).resolves.toBe('foo');
  await expect(p).resolves.toBe('foo');
});
test(`SyncPromise.prototype.consume: returns rejecting promise when resolve is called with a rejecting promise`, async () => {
  const err = new Error('...');
  const p = new SyncPromise((resolve) => {
    resolve(Promise.reject(err));
  });

  const r = p.consume();
  expect(r).toBeInstanceOf(Promise);
  await expect(r).rejects.toThrowError(err);
  await expect(p).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.consume: returns value when resolve is called with a resolved promise`, async () => {
  const p = new SyncPromise((resolve) => {
    resolve(Promise.resolve('foo'));
  });

  await expect(p).resolves.toBe('foo');
  expect(p.consume()).toBe('foo');
});
test(`SyncPromise.prototype.consume: throws when resolve is called with a rejected promise`, async () => {
  const err = new Error('...');
  const p = new SyncPromise((resolve) => {
    resolve(Promise.reject(err));
  });

  await expect(p).rejects.toThrowError(err);
  expect(() => p.consume()).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync resolution`, () => {
  const value = new SyncPromise((resolve) => resolve('foo'))
    .operate()
    .consume();

  expect(value).toBe('foo');
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ sync returning success`, () => {
  const value = new SyncPromise((resolve) => resolve('foo'))
    .operate((value) => value + 'bar')
    .consume();

  expect(value).toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ sync throwing success`, () => {
  const err = new Error('...');
  expect(() => {
    new SyncPromise((resolve) => resolve('foo'))
      .operate(() => {
        throw err;
      })
      .consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ async resolving success`, async () => {
  const value = new SyncPromise((resolve) => resolve('foo'))
    .operate((value) => Promise.resolve(value + 'bar'))
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ async rejecting success`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((resolve) => resolve('foo'))
    .operate(() => Promise.reject(err))
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ sync returning success and finalize`, () => {
  const fn: any = vi.fn();
  const v1 = new SyncPromise((resolve) => resolve('foo'))
    .operate((value) => value + 'bar', null, fn)
    .consume();

  expect(v1).toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);

  const v2 = new SyncPromise((resolve) => resolve('foo'))
    .operate(null, null, fn)
    .consume();

  expect(v2).toBe('foo');
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ sync throwing success and finalize`, () => {
  const err = new Error('...');

  expect(() => {
    new SyncPromise((resolve) => resolve('foo'))
      .operate(
        () => {
          throw new Error('...');
        },
        null,
        () => {
          throw err;
        }
      )
      .consume();
  }).toThrowError(err);

  expect(() => {
    new SyncPromise((resolve) => resolve('foo'))
      .operate(null, null, () => {
        throw err;
      })
      .consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ async resolving success and finalize`, async () => {
  const fn: any = vi.fn(() => wait(250));
  const v1 = new SyncPromise((resolve) => resolve('foo'))
    .operate((value) => Promise.resolve(value + 'bar'), null, fn)
    .consume();

  const start = Date.now();
  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);
  expect(Date.now() - start).toBeGreaterThanOrEqual(250);

  const v2 = new SyncPromise((resolve) => resolve('foo'))
    .operate(null, null, fn)
    .consume();
  await expect(v2).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, sync resolution w/ async rejecting success and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((resolve) => resolve('foo'))
    .operate(
      () => Promise.reject(new Error('...')),
      null,
      () => Promise.reject(err)
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((resolve) => resolve('foo'))
    .operate(null, null, () => Promise.reject(err))
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection`, () => {
  const err = new Error('...');

  expect(() => {
    new SyncPromise((_, reject) => reject(err)).operate(null).consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ sync returning failure`, () => {
  const value = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, (reason) => reason + 'bar')
    .consume();

  expect(value).toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ sync throwing failure`, () => {
  const err = new Error('...');

  expect(() => {
    new SyncPromise((_, reject) => reject('foo'))
      .operate(null, () => {
        throw err;
      })
      .consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ async resolving failure`, async () => {
  const value = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, (reason) => Promise.resolve(reason + 'bar'))
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ async rejecting failure`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, () => Promise.reject(err))
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ sync returning failure and finalize`, () => {
  const fn: any = vi.fn();
  const value = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, (reason) => reason + 'bar', fn)
    .consume();

  expect(value).toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);

  const err = new Error('...');
  expect(() => {
    new SyncPromise((_, reject) => reject(err))
      .operate(null, null, fn)
      .consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ sync throwing failure and finalize`, () => {
  const err = new Error('...');

  expect(() => {
    new SyncPromise((_, reject) => reject('foo'))
      .operate(
        null,
        () => {
          throw new Error('...');
        },
        () => {
          throw err;
        }
      )
      .consume();
  }).toThrowError(err);

  expect(() => {
    new SyncPromise((_, reject) => reject('foo'))
      .operate(null, null, () => {
        throw err;
      })
      .consume();
  }).toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ async resolving failure and finalize`, async () => {
  const fn: any = vi.fn(() => wait(250));
  const v1 = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, (reason) => reason + 'bar', fn)
    .consume();

  const start = Date.now();
  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);
  expect(Date.now() - start).toBeGreaterThanOrEqual(250);

  const v2 = new SyncPromise((_, reject) => reject(new Error('...')))
    .operate(null, null, fn)
    .consume();

  await expect(v2).rejects.toThrowError();
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, sync rejection w/ async rejecting failure and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((_, reject) => reject('foo'))
    .operate(
      null,
      () => Promise.reject(new Error('...')),
      () => Promise.reject(err)
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((_, reject) => reject('foo'))
    .operate(null, null, () => Promise.reject(err))
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async resolution`, async () => {
  const value = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate()
    .consume();

  await expect(value).resolves.toBe('foo');
});
test(`SyncPromise.prototype.operate: case, async resolution w/ sync returning success`, async () => {
  const value = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate((value) => value + 'bar')
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, async resolution w/ sync throwing success`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(() => {
      throw err;
    })
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async resolution w/ async resolving success`, async () => {
  const value = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate((value) => Promise.resolve(value + 'bar'))
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, async resolution w/ async rejecting success`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(() => Promise.reject(err))
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async resolution w/ sync returning success and finalize`, async () => {
  const fn: any = vi.fn();
  const v1 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate((value) => value + 'bar', null, fn)
    .consume();

  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);

  const v2 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(null, null, fn)
    .consume();

  await expect(v2).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, async resolution w/ sync throwing success and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(
      () => {
        throw new Error('...');
      },
      null,
      () => {
        throw err;
      }
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(null, null, () => {
      throw err;
    })
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async resolution w/ async resolving success and finalize`, async () => {
  const fn: any = vi.fn(() => wait(250));
  const v1 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate((value) => Promise.resolve(value + 'bar'), null, fn)
    .consume();

  const start = Date.now();
  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);
  expect(Date.now() - start).toBeGreaterThanOrEqual(250);

  const v2 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(null, null, fn)
    .consume();
  await expect(v2).resolves.toBe('foo');
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, async resolution w/ async rejecting success and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(
      () => Promise.reject(new Error('...')),
      null,
      () => Promise.reject(err)
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((resolve) => {
    setTimeout(() => resolve('foo'), 0);
  })
    .operate(null, null, () => Promise.reject(err))
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((_, reject) => {
    setTimeout(() => reject(err), 0);
  })
    .operate()
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ sync returning failure`, async () => {
  const value = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, (reason) => reason + 'bar')
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, async rejection w/ sync throwing failure`, async () => {
  const err = new Error('...');

  const value = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, () => {
      throw err;
    })
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ async resolving failure`, async () => {
  const value = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, (reason) => Promise.resolve(reason + 'bar'))
    .consume();

  await expect(value).resolves.toBe('foobar');
});
test(`SyncPromise.prototype.operate: case, async rejection w/ async rejecting failure`, async () => {
  const err = new Error('...');
  const value = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, () => Promise.reject(err))
    .consume();

  await expect(value).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ sync returning failure and finalize`, async () => {
  const fn: any = vi.fn();
  const v1 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, (reason) => reason + 'bar', fn)
    .consume();

  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);

  const err = new Error('...');
  const v2 = new SyncPromise((_, reject) => {
    setTimeout(() => reject(err), 0);
  })
    .operate(null, null, fn)
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ sync throwing failure and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(
      null,
      () => {
        throw new Error('...');
      },
      () => {
        throw err;
      }
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, null, () => {
      throw err;
    })
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ async resolving failure and finalize`, async () => {
  const fn: any = vi.fn(() => wait(250));
  const v1 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, (reason) => reason + 'bar', fn)
    .consume();

  const start = Date.now();
  await expect(v1).resolves.toBe('foobar');
  expect(fn).toHaveBeenCalledTimes(1);
  expect(Date.now() - start).toBeGreaterThanOrEqual(250);

  const v2 = new SyncPromise((_, reject) => {
    setTimeout(() => reject(new Error('...')), 0);
  })
    .operate(null, null, fn)
    .consume();

  await expect(v2).rejects.toThrowError();
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`SyncPromise.prototype.operate: case, async rejection w/ async rejecting failure and finalize`, async () => {
  const err = new Error('...');
  const v1 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(
      null,
      () => Promise.reject(new Error('...')),
      () => Promise.reject(err)
    )
    .consume();

  await expect(v1).rejects.toThrowError(err);

  const v2 = new SyncPromise((_, reject) => {
    setTimeout(() => reject('foo'), 0);
  })
    .operate(null, null, () => Promise.reject(err))
    .consume();

  await expect(v2).rejects.toThrowError(err);
});
test(`SyncPromise.from: case, sync return`, () => {
  const value = SyncPromise.from(() => 'foo').consume();

  expect(value).toBe('foo');
});
test(`SyncPromise.from: case, sync throw`, () => {
  const err = new Error('...');

  expect(() => {
    SyncPromise.from(() => {
      throw err;
    }).consume();
  }).toThrowError(err);
});
test(`SyncPromise.from: case, sync resolution`, async () => {
  const value = SyncPromise.from(() => Promise.resolve('foo')).consume();

  await expect(value).resolves.toBe('foo');
});
test(`SyncPromise.from: case, sync rejection`, async () => {
  const err = new Error('...');
  const value = SyncPromise.from(() => Promise.reject(err)).consume();

  await expect(value).rejects.toThrowError(err);
});
