import { useEffect } from 'react';
import addBackendSubscription from '../lib/addBackendSubscription';

export default function useBackendSubscription(event, handler) {
  useEffect(() => addBackendSubscription(event, handler), []);
}
