import { useEffect, useState } from 'react';
import requestFromWorker from '../lib/requestFromWorker';

export default function useUser() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await requestFromWorker('fetch-user');
        setUser(user);
      } catch (e) {
        console.log(e);
      }
    }

    fetchUser();
  }, []);

  return { user, setUser };
}
