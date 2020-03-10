import fs from 'fs';
import { join as pathJoin } from 'path';
import { existsSync } from 'fs';

export class InkFile {
  constructor(name, remoteUrl) {
    this.name = name;
    this.remoteUrl = remoteUrl;
  }

  save(projectPath) {
    let jsonObj = JSON.stringify(this, null, 2);
    let path = pathJoin(projectPath, 'ink.json');
    fs.writeFileSync(path, jsonObj);
    console.log('Config saved at:', path);
  }
}
export var defaultInkFile;

export function initInkFile(name, projectPath, remoteUrl) {
  let inkFile = new InkFile(name, remoteUrl);
  inkFile.save(projectPath);
  defaultInkFile = inkFile;
}

export function loadInkFile(projectPath) {
  let path = pathJoin(projectPath, 'ink.json');
  let config = JSON.parse(fs.readFileSync(path));
  defaultInkFile = new InkFile(config.name, config.remoteUrl);
}

export function applyDiff(projectPath, delta) {
  //TODO: Do something
  defaultInkFile.save(projectPath);
}

export function checkInitInkFile(name, path, remoteUrl) {
  let configPath = pathJoin(path, 'ink.json');
  if(existsSync(configPath)) {
    loadInkFile(path);
  } else {
    initInkFile(name, path, remoteUrl);
  }
}
