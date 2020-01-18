import createDebug from 'debug';
import * as projectStore from '../lib/project-store';
import * as userStore from '../lib/user-store';
import { handleRequest } from '../backend/handlers';
import { setConfig } from '../lib/config';

export function initBackend() {
  createDebug.enable('backend*');
  const debug = createDebug('backend');
  debug('Backend worker initializing');

  const handleEvent = async ({ id, event, data }) => {
    if (event === 'init') {
      setConfig(data);
      projectStore.init();
      userStore.init();
      process.send({
        id,
        response: 'ready'
      });
    } else {
      process.send({
        id,
        response: await handleRequest(event, data),
      });
    }
  };

  process.on('message', handleEvent);
  process.on('exit', () => debug('Background worker shutting down'));
}
