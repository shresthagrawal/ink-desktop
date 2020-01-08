import { useEffect, useState } from 'react';
import requestFromWorker from '../lib/requestFromWorker';

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);

      try {
        const user = await requestFromWorker('fetch-user');
        setUser(user);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    fetchUser();
  }, []);

  return { user, setUser, loading };
}
