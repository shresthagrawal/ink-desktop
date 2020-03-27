import { ipcRenderer as ipc } from 'electron-better-ipc';
import { v4 as uuid } from 'uuid';

export async function request(event, data = undefined) {
  const id = uuid();
  const { response, error } = await ipc.callMain('to-worker', {
    id,
    event,
    data,
  });

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
