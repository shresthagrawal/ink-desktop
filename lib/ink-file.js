import fs from 'fs';
import { join as pathJoin } from 'path';
import { existsSync } from 'fs';

export class InkFile {
  constructor(name, path, remoteUrl, tracks=[]) {
    this.name = name;
    this.path = path;
    this.remoteUrl = remoteUrl;
    this.tracks = tracks;
  }

  save() {
    let jsonObj = JSON.stringify(this, null, 2);
    let configPath = pathJoin(this.path, 'ink.json');
    fs.writeFileSync(configPath, jsonObj);
    console.log('Config saved at:', configPath);
  }
}
export var defaultInkFile;

export function initInkFile(name, path, remoteUrl) {
  let inkFile = new InkFile(name, path, remoteUrl);
  inkFile.save();
  defaultInkFile = inkFile;
}

export function loadInkFile(path) {
  let configPath = pathJoin(path, 'ink.json');
  let config = JSON.parse(fs.readFileSync(configPath));
  defaultInkFile = new InkFile(config.name, config.path, config.tracks);
}

export function applyDiff(delta) {
  defaultInkFile.tracks = defaultInkFile.tracks.concat(delta.tracks);
  defaultInkFile.save();
}

export function checkInitInkFile(name, path, remoteUrl) {
  let configPath = pathJoin(path, 'ink.json');
  if(existsSync(configPath)) {
    loadInkFile(path);
  } else {
    initInkFile(name, path, remoteUrl);
  }
}
