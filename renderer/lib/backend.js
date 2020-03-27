import { ipcRenderer as ipc } from 'electron-better-ipc';
import { v4 as uuid } from 'uuid';

export async function request(event, data = undefined, opts = {}) {
  const id = uuid();
  const progress = typeof opts.onProgress === 'function';
  let removeProgressSubscription;

  if (progress) {
    removeProgressSubscription = subscribe(`progress-${id}`, (progress) =>
      opts.onProgress(progress)
    );
  }

  const { response, error } = await ipc.callMain('to-worker', {
    id,
    event,
    data,
    progress,
  });

  if (progress && removeProgressSubscription) {
    removeProgressSubscription();
  }

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
