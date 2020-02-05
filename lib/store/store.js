import Conf from 'conf';
import semver from 'semver'
import migrations from './migrations';
import { config } from '../config';

const storeVersion = '0.1.0'

// just take the original ElectronStore, but remove the `electron.app` reference
// <https://github.com/sindresorhus/electron-store/blob/f88a6463bcf7e720629e04b7f1336a133bf9bff3/index.js>
class StoreWrapper extends Conf {
  constructor(options) {
    options = {
      name: 'config',
      cwd: config.dataDir,
      ...options,
    };

    options.configName = options.name;
    delete options.name;
    super(options);
  }
}

export class Store {
  constructor(documentName, objectName, defaultValue) {
    this.internalStore = new StoreWrapper({ name: documentName });
    this.objectName = objectName;
    this.defaultValue = defaultValue;

    if (typeof this.version === 'undefined' && process.env.NODE_ENV === 'production') {
      this.internalStore.set('version', storeVersion)
    } else {
      validateStoreVersion(this.internalStore, migrations)
    }
  }

  get version() {
    return this.internalStore.get('version')
  }

  get() {
    return this.internalStore.get(this.objectName, this.defaultValue);
  }

  set(newValue) {
    return this.internalStore.set(this.objectName, newValue);
  }

  delete() {
    return this.internalStore.delete(this.objectName);
  }
}

export function validateStoreVersion(store, migrations) {
  const initialData = store.store
  const storeVersion = store.get('version') || '0.0.0'
  let lastVersion = storeVersion

  const newerVersions = Object.keys(migrations)
    .sort((a, b) => semver.lt(a, b) ? -1 : 1)
    .filter(version => semver.lt(storeVersion, version))

  if (newerVersions.length === 0) {
    return
  }

  for (const version of newerVersions) {
    const migrate = migrations[version]
    const storeData = store.store

    try {
      store.store = migrate(storeData)
      store.set('version', version)

      lastVersion = version
    } catch (err) {
      console.error(`Migration from ${lastVersion} to ${version} failed (rolling back):`, err)
      store.store = initialData
      break;
    }
  }
}
