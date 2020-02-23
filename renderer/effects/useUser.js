import useBackendRequest from './useBackendRequest';

export default function useUser() {
  const [user, setUser, loading] = useBackendRequest('fetch-user');
  return { user, setUser, loading };
}
