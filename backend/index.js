import dotenv from 'dotenv';
import createDebug from 'debug';
import { handleRequest } from './handlers';
import * as projectStore from '../lib/store/project-store';
import * as userStore from '../lib/store/user-store';
import { setConfig } from '../lib/config';
import { ParserManager } from '../lib/parser';

dotenv.config();

export function initBackend() {
  createDebug.enable('backend*');
  const debug = createDebug('backend');
  debug('Backend worker initializing');

  const processMessages = () =>
    process.on('message', async ({ id, event, data }) => {
      process.send({
        id,
        response: await handleRequest(event, data),
      });
    });

  const handleInit = ({ event, dataDir }) => {
    if (event === 'init') {
      process.removeListener('message', handleInit);
      setConfig({
        dataDir,
      });

      projectStore.init();
      userStore.init();

      processMessages();
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
