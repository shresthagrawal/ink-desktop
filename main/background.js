import { app } from 'electron';
import serve from 'electron-serve';
import { ipcMain as ipc } from 'electron-better-ipc';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import url from 'url';
import { createWindow, exitOnChange } from './helpers';
import forkBackend from './helpers/fork-backend';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow, workerProcess;
let openImportProject;

async function sendRequest(
  workerProcess,
  { id: requestId, event, data, ...opts }
) {
  if (!requestId || !event) {
    throw new Error('Malformed event received');
  }

  return new Promise((resolve) => {
    const handleResponse = ({ id: responseId, response, error }) => {
      if (requestId === responseId) {
        workerProcess.removeListener('message', handleResponse);
        resolve({ id: responseId, response, error });
      }
    };
    workerProcess.on('message', handleResponse);
    workerProcess.send({ id: requestId, event, data, ...opts });
  });
}

function delegateRequestEvents(workerProcess, eventName) {
  ipc.answerRenderer(
    eventName,
    async (event) => await sendRequest(workerProcess, event)
  );
}

function delegatePushEvents(workerProcess, rendererWindow, eventName) {
  const handlePush = ({ pushEvent }) => {
    if (!pushEvent || !pushEvent.event) {
      return;
    }
    ipc.callRenderer(rendererWindow, eventName, pushEvent);
  };
  workerProcess.on('message', handlePush);
  return () => workerProcess.removeListener('message', handlePush);
}

async function handleAppReady(workerProcess) {
  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
  });

  delegateRequestEvents(workerProcess, 'to-worker');
  delegatePushEvents(workerProcess, mainWindow, 'to-renderer');

  if (!isProd) {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL(`app://./home.html`);
  }
  if (openImportProject) openImportProject(mainWindow);
}

export async function main() {
  workerProcess = await forkBackend();

  if (app.isReady()) {
    await handleAppReady(workerProcess);
  } else {
    app.on('ready', () => handleAppReady(workerProcess));
  }
}

app.setAsDefaultProtocolClient('ink');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  if (workerProcess) {
    workerProcess.kill('SIGHUP');
  }
});

app.on('open-url', function (event, requestUrl) {
  const parsedUrl = url.parse(requestUrl, true);
  if (parsedUrl.protocol !== 'ink:') {
    return;
  }

  const openImportProject = (rendererWindow) => {
    ipc.callRenderer(rendererWindow, 'to-renderer', {
      event: 'import-project-from-external',
      data: {
        remoteUrl: parsedUrl.query.url,
      },
    });
  };
  if (mainWindow) openImportProject(mainWindow);
});

main();
