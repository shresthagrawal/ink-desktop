import { ParserManager } from './parser';
import { platform } from 'process';
import { spawn } from 'child_process';
import path from 'path';
import glob from 'glob';

export async function openProject(projectId, filePath) {
  const parserObj = await ParserManager.getInstance(projectFileId);
  if (parserObj[filePath].type === 'ableton-project') {
    spawn(getAbletonPath(), filePath);
  } else {
    throw Error(`Project type not recognised: ${parserObj.project.type}`);
  }
}

export function getAbletonPath() {
  if (platform !== 'darwin') {
    return null;
  }

  const options = {
    cwd: '/Applications',
    absolute: true,
  };
  const files = glob.sync('*Ableton*', options);
  if (!files.length) {
    return null;
  }

  return path.join(files[0], '/Contents/MacOS/Live');
}
