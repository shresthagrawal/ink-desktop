import { ipcRenderer as ipc } from 'electron-better-ipc';

export async function request(event, data = undefined) {
  const { response, error } = await ipc.callMain('to-worker', { event, data });

  if (error) {
    throw new Error(error);
  }
  return response;
}

export function subscribe(subscriptionEvent, handler) {
  return ipc.answerMain('to-renderer', ({ event, data }) => {
    if (event !== subscriptionEvent) {
      return;
    }

    handler(data);
  });
}
