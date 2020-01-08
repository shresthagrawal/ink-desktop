import { useEffect, useState } from 'react';
import requestFromWorker from '../lib/requestFromWorker';

export default function useProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const projects = await requestFromWorker('fetch-projects');
      setProjects(projects);
    }

    fetchProjects();
  }, []);

  return { projects, setProjects };
}
