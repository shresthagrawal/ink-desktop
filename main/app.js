import { app } from 'electron';
import serve from 'electron-serve';
import { ipcMain as ipc } from 'electron-better-ipc';
import uuid from 'uuid/v1';
import { createWindow, exitOnChange } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

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

export async function startApp(workerProcess) {
  const delayedStart = async () => {
    const mainWindow = createWindow('main', {
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
      await mainWindow.loadURL(`app://./index.html`);
    }

    ipc.answerRenderer(
      'to-worker',
      async ({ event, data }) => await sendRequest(workerProcess, event, data)
    );
  };

  if (app.isReady()) {
    delayedStart();
  } else {
    app.on('ready', delayedStart);
  }
  app.on('window-all-closed', () => {
    app.quit();
  });
}
