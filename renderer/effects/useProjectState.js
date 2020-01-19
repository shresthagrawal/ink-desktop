import { useEffect, useState } from 'react';
import requestFromWorker from '../lib/requestFromWorker';

export default function useProjectState(projectPath, interval = null) {
  const [state, setState] = useState({
    status: {},
    graph: [],
    delta: {},
  });

  const getState = async () => {
    try {
      const res = await requestFromWorker('get-project-state', projectPath);
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
