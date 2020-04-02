import path from 'path';
import { fork } from 'child_process';
import { app } from 'electron';

export default function forkBackend() {
  return new Promise((resolve) => {
    let workerProcess;
    const handleReady = (message) => {
      if (message === 'ready') {
        workerProcess.removeListener('message', handleReady);
        resolve(workerProcess);
      }
    };

    workerProcess = fork(path.join(__dirname, 'backend.js'));
    workerProcess.on('message', handleReady);
    workerProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        throw new Error(
          `Backend thread unexpectedly exited with code ${code}.`
        );
      }
    });

    workerProcess.send({
      event: 'init',
      dataDir: app.getPath('userData'),
    });
  });
}
