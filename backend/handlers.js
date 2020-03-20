import * as userStore from '../lib/store/user-store';
import * as projectStore from '../lib/store/project-store';
import {
  initProject,
  commitProject,
  getProjectState,
  cloneProject,
} from '../lib/project';
import { push, pull, getRemote } from '../lib/git/utils';
import { ParserManager } from '../lib/parser';
import { getById } from '../lib/store/project-store';
import { getAbletonPath, openProject } from '../lib/daw';

const handlers = new Map();
function registerHandler(event, handler) {
  handlers.set(event, handler);
}
export async function handleRequest(event, data, onProgress) {
  if (handlers.has(event) && typeof handlers.get(event) === 'function') {
    return handlers.get(event)(data, onProgress);
  }
  // FIXME: what if there is no handler registered?
}

registerHandler('fetch-user', () => userStore.get());
registerHandler('set-user', ({ email }) => {
  const user = new userStore.User(email);
  return userStore.set(user);
});

registerHandler('fetch-projects', () => projectStore.list());
registerHandler('delete-project', (projectId) =>
  projectStore.remove(projectId)
);
registerHandler('reset-projects', () => projectStore.reset());
registerHandler(
  'add-project',
  async (projectPath) => await initProject(projectPath)
);
registerHandler(
  'get-project-state',
  async (projectId) => await getProjectState(projectId)
);
registerHandler('commit-project', async ({ projectId, commitMessage }) => {
  const user = userStore.get();
  return await commitProject(projectId, commitMessage, user.email);
});
registerHandler('push-project', async ({ projectId }, onProgress) => {
  const project = getById(projectId);
  await push(project.path, 'origin', 'master', 'master', onProgress);
});
registerHandler('pull-project', async ({ projectId }, onProgress) => {
  const project = getById(projectId);
  await pull(project.path, 'origin', 'master', 'master', onProgress);
  await ParserManager.resetInstance(projectId);
});
registerHandler(
  'clone-project',
  async ({ remoteUrl, projectFolder }, onProgress) =>
    await cloneProject(remoteUrl, projectFolder, onProgress)
);
registerHandler(
  'open-project',
  // TODO: Fix this for the user to choose the proect to open.
  async ({ projectId }) => await openProject(projectId)
);
// TODO: Temporarily disabled until the above todo is fixed 
// registerHandler('can-open-project', () => getAbletonPath() !== null);
registerHandler('can-open-project', () => false);

registerHandler('get-remote', async ({ projectId }) => {
  let project = getById(projectId);
  let remote = await getRemote(project.path, 'origin');
  return remote.url();
});
