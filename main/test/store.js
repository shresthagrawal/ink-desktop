import { Volume } from 'memfs';
import { patchFs } from 'fs-monkey';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { setConfig } from '../../lib/config';
import { Store, validateStoreVersion } from '../../lib/store/store';

chai.use(chaiAsPromised);
chai.should();
const { expect } = chai;

const migrationOne = '0.1.0';
const migrationTwo = '2.0.1';
const migrations = {
  [migrationOne]: store => ({
    ...store,
    foo: 'bar',
    bar: 'baz',
  }),

  [migrationTwo]: store => ({
    ...store,
    foo: 'baz',
    baz: 'bar',
  }),
};

describe('configuration store', function() {
  beforeEach(async function() {
    const mockVolume = new Volume();
    this.unpatch = patchFs(mockVolume);

    setConfig({
      dataDir: '/',
    });
  });

  afterEach(function() {
    if (this.unpatch) {
      this.unpatch();
    }
  });

  it('should apply no migrations if the store versions is the current', function() {
    const store = new Store('bar', 'foo', '');
    store.internalStore.set('foo', 'a');
    store.internalStore.set('version', '3.0.0');

    validateStoreVersion(store.internalStore, migrations);
    expect(store.internalStore.store).to.deep.equal({
      foo: 'a',
      version: '3.0.0',
    });
  });

  it('should apply all migrations if no version has been set', function() {
    const store = new Store('bar', 'foo', 'foo');
    store.internalStore.set('foo', 'a');

    validateStoreVersion(store.internalStore, migrations);
    expect(store.internalStore.store).to.deep.equal({
      version: migrationTwo,
      foo: 'baz',
      bar: 'baz',
      baz: 'bar',
    });
  });

  it('should apply the matching migrations if a particular version has been set', function() {
    const store = new Store('bar', 'foo', 'foo');
    store.internalStore.set('foo', 'a');
    store.internalStore.set('version', '1.0.0');

    validateStoreVersion(store.internalStore, migrations);
    expect(store.internalStore.store).to.deep.equal({
      version: migrationTwo,
      foo: 'baz',
      baz: 'bar',
    });
  });
});
