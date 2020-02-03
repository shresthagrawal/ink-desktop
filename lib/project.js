import { basename } from 'path';
import uuid from 'uuid/v4';
import Git from 'nodegit';
import * as projectStore from './store/project-store';
import { manageResource } from './resource';
import {
  gitCheckAndInit,
  gitStatus,
  gitCommit,
} from './git/utils';
import { checkInitInkFile, loadInkFile, applyDiff } from './ink-file';
import { getGraph } from './git/graph';
import { ParserManager } from './parser';
import { checkCreateRemote } from './git-server';

export async function initProject(path) {
  await gitCheckAndInit(path);

  // TODO: Handle the case where the projects have same name.
  let name = basename(path);
  let remoteUrl = await checkCreateRemote(name, path, 'origin')

  checkInitInkFile(name, path, remoteUrl);

  if (projectStore.getByPath(path) == undefined) {
    let project = new projectStore.Project(uuid(), name, path, 'ableton-project');
    return projectStore.append(project);
  }
  return projectStore.list();
}

export async function getProjectState(projectPath) {
  try {
    loadInkFile(projectPath);

    const repo = await Git.Repository.open(`${projectPath}/.git`);
    // TODO: Use the state of the ink file
    const status = await gitStatus(repo);
    const graph = await getGraph(repo);
    const parser = await ParserManager.getInstance(projectPath);
    const delta = parser.getDiff();
    // TODO: To Some how use this resource modified value.
    const deltaResource = manageResource(projectPath);
    return { status, graph, delta };
  } catch (err) {
    console.error('Bad Error:', err);
    return {};
  }
}

export async function commitProject(projectPath, commitMessage, userEmail) {
  const parser = await ParserManager.getInstance(projectPath);
  applyDiff(parser.getDiff());
  return await gitCommit(projectPath, commitMessage, userEmail);
}
