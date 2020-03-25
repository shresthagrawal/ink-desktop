import { useEffect, useState } from 'react';
import { request } from '../lib/backend';
import createDebug from 'debug';

const error = createDebug('frontend:error');

export default function useBackendRequest(type, payload) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        setData(await request(type, payload));
        setLoading(false);
      } catch (err) {
        error(err);
      }
    }

    fetchData();
  }, []);

  return [data, setData, loading];
}
