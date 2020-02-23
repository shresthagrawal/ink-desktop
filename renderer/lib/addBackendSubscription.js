import { ipcRenderer as ipc } from 'electron-better-ipc';

export default function addBackendSubscription(subscriptionEvent, handler) {
  return ipc.answerMain('to-renderer', ({ event, data }) => {
    if (event !== subscriptionEvent) {
      return;
    }

    handler(data);
  });
}
