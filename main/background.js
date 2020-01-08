import { fork } from 'child_process';
import createDebug from 'debug';
import * as projectStore from '../backend/lib/project-store';
import * as userStore from '../backend/lib/user-store';

if (process.argv[2] === '--backend') {
  createDebug.enable('backend*');
  const debug = createDebug('backend');
  debug('Backend worker initializing');
  const { handleRequest } = require('../backend/handlers');

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

      projectStore.init(dataDir);
      userStore.init(dataDir);

      processMessages();
      process.send('ready');
    } else {
      console.error('Invalid message received, expected `init` event.');
    }
  };

  process.on('message', handleInit);
  process.on('exit', () => debug('Background worker shutting down'));
} else {
  const { app } = require('electron');
  const { startApp } = require('./app');

  const handleReady = message => {
    if (message === 'ready') {
      workerProcess.removeListener('message', handleReady);
      startApp(workerProcess);
    }
  };

  const workerProcess = fork(__filename, ['--backend']);
  workerProcess.on('message', handleReady);
  workerProcess.send({
    event: 'init',
    dataDir: app.getPath('userData'),
  });
}
