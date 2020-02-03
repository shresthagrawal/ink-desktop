import fs from 'fs';
import { join as pathJoin } from 'path';

export class InkFile {
  constructor(name, remoteUrl, tracks=[]) {
    this.name = name;
    this.remoteUrl = remoteUrl;
    this.tracks = tracks;
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
  defaultInkFile = new InkFile(config.name, config.remoteUrl, config.tracks);
}

export function applyDiff(projectPath, delta) {
  defaultInkFile.tracks = defaultInkFile.tracks.concat(delta.tracks);
  defaultInkFile.save(projectPath);
}
