import path from 'path';
import uuid from 'uuid/v4';
import Git from 'nodegit';
import * as projectStore from './store/project-store';
import { manageResource } from './resource';
import { gitCheckAndInit, gitStatus, gitCommit, gitClone } from './git/utils';
import { checkInitInkFile, loadInkFile, applyDiff } from './ink-file';
import { getGraph } from './git/graph';
import { ParserManager } from './parser';
import { checkCreateRemote } from './git-server';
import { getByPath, getById } from './store/project-store';

export async function initProject(projectPath) {
  await gitCheckAndInit(projectPath);

  // TODO: Handle the case where the projects have same name.
  let name = path.basename(projectPath);
  let remoteUrl = await checkCreateRemote(name, projectPath, 'origin');

  checkInitInkFile(name, projectPath, remoteUrl);

  if (!getByPath(projectPath)) {
    let project = new projectStore.Project(
      uuid(),
      name,
      projectPath,
      'ableton-project'
    );
    return projectStore.append(project);
  }
  return projectStore.list();
}

export async function getProjectState(projectId) {
  try {
    const project = getById(projectId);
    loadInkFile(project.path);

    const repo = await Git.Repository.open(`${project.path}/.git`);
    // TODO: Use the state of the ink file
    const status = await gitStatus(repo);
    const graph = await getGraph(repo);
    const parser = await ParserManager.getInstance(project.id);
    const delta = parser.getDiff();
    // TODO: To Some how use this resource modified value.
    const deltaResource = manageResource(project);
    return { status, graph, delta };
  } catch (err) {
    console.error('Bad Error:', err);
    return {};
  }
}

export async function commitProject(projectId, commitMessage, userEmail) {
  const project = getById(projectId);
  const parser = await ParserManager.getInstance(project.id);
  applyDiff(project.path, parser.getDiff());
  return await gitCommit(project.path, commitMessage, userEmail);
}

export async function cloneProject(remoteUrl, projectFolder) {
  let projectPath = path.join(projectFolder, path.parse(remoteUrl).name)
  await gitClone(remoteUrl, projectPath)
  return await initProject(projectPath)
}
