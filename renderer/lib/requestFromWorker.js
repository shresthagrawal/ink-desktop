import { ipcRenderer as ipc } from 'electron-better-ipc';

export default async function requestFromWorker(event, data = undefined) {
  return await ipc.callMain('to-worker', { event, data });
}
