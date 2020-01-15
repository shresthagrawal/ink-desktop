import Conf from 'conf';
import { config } from './config';

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
    this.store = new StoreWrapper({ name: documentName });
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
