import { ParserManager, projectType } from './parser';
import { platform } from 'process';
import { spawn } from 'child_process';
import { getById } from './store/project-store';
import path from 'path';
import glob from 'glob';

export async function openProject(projectId, filePath) {
  const parsers = await ParserManager.getInstance(projectId);
  const project = getById(projectId);
  if (filePath === '') filePath = ParserManager.getDefaultProjectFile(project.path);

  if (parsers[filePath].type === projectType.abletonLive) {
    spawn(getAbletonPath(), [filePath]);
  } else {
    throw Error(`Project type not recognised: ${parsers.project.type}`);
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
