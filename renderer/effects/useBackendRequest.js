import { useEffect, useState } from 'react';
import requestFromWorker from '../lib/requestFromWorker';

export default function useBackendRequest(type, payload) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        setData(await requestFromWorker(type, payload))
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, []);

  return [data, setData, loading];
}
