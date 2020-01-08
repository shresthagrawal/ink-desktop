import Conf from 'conf';
import path from 'path';

// just take the original ElectronStore, but remove the `electron.app` reference
// <https://github.com/sindresorhus/electron-store/blob/f88a6463bcf7e720629e04b7f1336a133bf9bff3/index.js>
class StoreWrapper extends Conf {
  constructor(cwd, options) {
    options = {
      name: 'config',
      cwd,
      ...options,
    };

    options.configName = options.name;
    delete options.name;
    super(options);
  }
}

export class Store {
  constructor(dataDir, documentName, objectName, defaultValue) {
    this.store = new StoreWrapper(dataDir, { name: documentName });
    this.objectName = objectName;
    this.defaultValue = defaultValue;
  }

  get() {
    return this.store.get(this.objectName, this.defaultValue);
  }

  set(newValue) {
    return this.store.set(this.objectName, newValue);
  }

  delete() {
    return this.store.delete(this.objectName);
  }
}
