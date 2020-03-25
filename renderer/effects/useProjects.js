import { useEffect, useState } from 'react';
import {request} from '../lib/backend';

export default function useProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const projects = await request('fetch-projects');
      setProjects(projects);
    }

    fetchProjects();
  }, []);

  return { projects, setProjects };
}
