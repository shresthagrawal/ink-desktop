import { fork } from 'child_process';

export default async function forkBackend() {
  let workerProcess = await fork(__filename, ['--backend']);
  workerProcess.on('exit', code => {
    if (code !== 0) {
      throw new Error(
        `Backend thread unexpectedly exited with code ${code}.`
      );
    }
  });
  return workerProcess;
}
