import { useEffect, useState } from 'react';
import { ipcRenderer as ipc } from 'electron-better-ipc';

export default function useProjectState(projectPath, interval = null) {
  const [state, setState] = useState({
    status: {},
    graph: [],
    delta: {},
  });

  const getState = async () => {
    try {
      const res = await ipc.callMain('get-project-state', projectPath);
      setState(res);
    } catch (err) {
      console.error('Bad Error:', err);
    }
  };

  useEffect(() => {
    if (!projectPath) {
      return;
    }

    if (interval !== null) {
      const id = setInterval(getState, interval);
      return () => clearInterval(id);
    } else {
      getState();
    }
  }, [projectPath]);

  return {
    ...state,
    reloadProjectState: getState,
  };
}
