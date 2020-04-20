import path from 'path';
import {v4 as uuid} from 'uuid';
import Git from 'nodegit';
import * as projectStore from './store/project-store';
import { manageResource } from './resource';
import { gitCheckAndInit, gitCommit, clone } from './git/utils';
import { gitAddIgnore } from './git/ignore';
import { checkInitInkFile, loadInkFile } from './ink-file';
import { getGraph } from './git/graph';
import { ParserManager, projectType } from './parser';
import { checkCreateRemote } from './git-server';
import { getByPath, getById } from './store/project-store';
import ProjectWatcher from './project-watcher';
import { getDiff } from './diff';

export async function initProject(projectPath) {
  await gitCheckAndInit(projectPath);
  // TODO: Handle the case where the projects have same name.
  let name = path.basename(projectPath);
  let remoteUrl = await checkCreateRemote(name, projectPath, 'origin');
  // TODO: get project type for gitignore
  await gitAddIgnore(projectPath, [projectType.abletonLive]);
  checkInitInkFile(name, projectPath, remoteUrl);

  if (!getByPath(projectPath)) {
    let project = new projectStore.Project(
      uuid(),
      name,
      projectPath
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
    const graph = await getGraph(repo);
    const parsers = await ParserManager.getInstance(project.id);
    manageResource(project, parsers);
    const watcher = await ProjectWatcher.getInstance(project.id, parsers);
    const diff = await getDiff(projectId);
    return { graph, diff };
  } catch (err) {
    console.error('Bad Error:', err);
    return {};
  }
}

export async function commitProject(projectId, commitMessage, userEmail) {
  const project = getById(projectId);
  // const parser = await ParserManager.getInstance(project.id);
  // applyDiff(project.path, parser.getDiff());
  return await gitCommit(project.path, commitMessage, userEmail);
}

export async function cloneProject(remoteUrl, projectFolder, onProgress) {
  let projectPath = path.join(projectFolder, path.parse(remoteUrl).name);
  await clone(remoteUrl, projectPath, onProgress);
  return await initProject(projectPath);
}
