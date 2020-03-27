import dotenv from 'dotenv';
import createDebug from 'debug';
import { handleRequest } from './handlers';
import * as projectStore from '../lib/store/project-store';
import * as userStore from '../lib/store/user-store';
import { setConfig } from '../lib/config';
import { ParserManager } from '../lib/parser';
import pushEvent from './pushEvent';

dotenv.config();

export function initBackend() {
  createDebug.enable('backend*');
  const debug = createDebug('backend');
  const error = createDebug('backend:error');
  debug('Backend worker initializing');

  const processRequests = () =>
    process.on('message', async ({ id, event, data, progress }) => {
      try {
        const handleProgress = progress
          ? (progress) => pushEvent(`progress-${id}`, progress)
          : undefined;

        process.send({ id, response: await handleRequest(event, data, handleProgress) });
      } catch (err) {
        error(`Error while handling request \`${event}\`:`, err);
        process.send({ id, error: err });
      }
    });

  const handleInit = ({ event, dataDir }) => {
    if (event === 'init') {
      process.removeListener('message', handleInit);
      setConfig({
        dataDir,
      });

      projectStore.init();
      userStore.init();

      processRequests();
      process.send('ready');
    } else {
      console.error('Invalid message received, expected `init` event.');
    }
  };

  process.on('message', handleInit);
  process.on('exit', () => {
    debug('Background worker shutting down');
    ParserManager.destroy();
  });
}

initBackend();
