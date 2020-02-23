import { app } from 'electron';
import serve from 'electron-serve';
import { ipcMain as ipc } from 'electron-better-ipc';
import uuid from 'uuid/v1';
import url from 'url';
import { createWindow, exitOnChange } from './helpers';
import forkBackend from './helpers/fork-backend';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow;

async function sendRequest(workerProcess, event, data) {
  const requestId = uuid();
  return new Promise(resolve => {
    const handleResponse = ({ id, response }) => {
      if (id === requestId) {
        workerProcess.removeListener('message', handleResponse);
        resolve(response);
      }
    };
    workerProcess.on('message', handleResponse);
    workerProcess.send({ id: requestId, event, data });
  });
}

async function handleAppReady(workerProcess) {
  ipc.answerRenderer(
    'to-worker',
    async ({ event, data }) => await sendRequest(workerProcess, event, data)
  );

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
  });

  if (!isProd) {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL(`app://./home.html`);
  }
}

export async function initApp() {
  const workerProcess = await forkBackend();

  if (app.isReady()) {
    await handleAppReady(workerProcess);
  } else {
    app.on('ready', () => handleAppReady(workerProcess));
  }
  app.on('window-all-closed', () => {
    app.quit();
  });
}

app.setAsDefaultProtocolClient('ink');

app.on('open-url', function(event, requestUrl) {
  let parsedUrl = url.parse(requestUrl, true);
  if (parsedUrl.protocol !== 'ink:' || !mainWindow) {
    return;
  }

  ipc.callRenderer(mainWindow, 'to-renderer', {
    event: 'import-project-from-external',
    data: {
      remoteUrl: parsedUrl.query.url,
    },
  });
});
