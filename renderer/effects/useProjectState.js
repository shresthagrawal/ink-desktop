import { useEffect, useState } from 'react';
import { ipcRenderer as ipc } from 'electron-better-ipc';

export default function useProjectState(projectPath) {
  const [state, setState] = useState({
    status: {},
    graph: [],
    delta: {},
  });

  useEffect(() => {
    const getState = async () => {
      try {
        const res = await ipc.callMain('get-project-state', projectPath);
        setState(res);
      } catch (err) {
        console.error('Bad Error:', err);
      }
    };

    if (projectPath) {
      getState();
    }
  }, [projectPath]);

  return state;
}
