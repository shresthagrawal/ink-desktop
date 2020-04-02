import { useEffect } from 'react';
import { subscribe } from '../lib/backend';

export default function useBackendSubscription(event, handler) {
  useEffect(() => subscribe(event, handler), []);
}
