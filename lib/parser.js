import { parseFile as abletonParseFile } from 'ableton-parser';
import { defaultInkFile } from './ink-file';
import { getByPath } from './store/project-store';
import glob from 'glob';
import { diffArrayTooSimple } from './utils/array';

const getTrackEffectiveName = track => track.Name[0].EffectiveName[0].$.Value;

export async function getParsedDiff(path) {
  let project = getByPath(path);
  let delta = {tracks: []};
  if (project.type === 'ableton-project') {
    let projectFile = getProjectFile(project);
    if (projectFile.length < 1) {
      throw new Error('Unable to find project file');
    }
    console.log('Parsing Ableton Project', projectFile[0]);
    // TODO: What happens if there are multiple project files

    const parser = await abletonParseFile(projectFile[0]);
    const tracks = parser.getTracks()[0].AudioTrack;
    const trackNames = tracks.map(getTrackEffectiveName);
    const diffedTrackNames = !Array.isArray(defaultInkFile.tracks)
      ? trackNames
      : diffArrayTooSimple(defaultInkFile.tracks, trackNames);
    if (diffedTrackNames.length > 0) {
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
