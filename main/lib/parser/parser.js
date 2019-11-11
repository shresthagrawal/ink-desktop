import { parseFile as abletonParseFile } from 'ableton-parser';
import { defaultInkFile } from './../ink-file/ink-file';
import { getByPath } from './../store/project-store';
import glob from 'glob';

export async function getParsedDiff(path) {
  let project = getByPath(path);
  let delta = {};
  if (project.type === 'ableton-project') {
    let projectFile = getProjectFile(project);
    if (projectFile.length < 1) {
      throw new Error('Unable to find project file');
    }
    console.log('Parsing Ableton Project', projectFile[0]);
    // TODO: What happens if there are multiple project files
    let parser = await abletonParseFile(projectFile[0]);
    let tracks = parser.getTracks()[0].AudioTrack;
    const trackNames = tracks.map(
      ({ Name }) => Name[0].EffectiveName[0].$.Value
    );
    if (
      !Array.isArray(defaultInkFile.tracks) ||
      JSON.stringify(trackNames) !== JSON.stringify(defaultInkFile.tracks)
    ) {
      delta.tracks = trackNames;
    }
    return delta;
  } else {
    throw new Error('Invalid Project Type');
  }
}

function getProjectFile(project) {
  let option = {
    cwd: project.path,
    absolute: true,
  };
  if (project.type == 'ableton-project') {
    return glob.sync('*.als', option);
  } else {
    return [];
  }
}
