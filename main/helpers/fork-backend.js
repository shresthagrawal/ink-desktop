import { fork } from 'child_process';
import { app } from 'electron';

export default function forkBackend() {
  return new Promise(resolve => {
    let workerProcess;
    const handleReady = message => {
      if (message === 'ready') {
        workerProcess.removeListener('message', handleReady);
        resolve(workerProcess);
      }
    };

    // FIXME: exit application if backend thread crashes
    workerProcess = fork(__filename, ['--backend']);
    workerProcess.on('message', handleReady);
    workerProcess.send({
      event: 'init',
      dataDir: app.getPath('userData'),
    });
  });
}
