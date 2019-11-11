import { useEffect, useState } from 'react';
import { ipcRenderer as ipc } from 'electron-better-ipc';

export default function useProjectState(projectPath) {
  const [state, setState] = useState({
    status: {},
    graph: [],
  });

  useEffect(() => {
    async function getState() {
      setState(await ipc.callMain('get-project-state', projectPath));
    }

    if (projectPath) {
      getState();
    }
  }, [projectPath]);

  return state;
}
