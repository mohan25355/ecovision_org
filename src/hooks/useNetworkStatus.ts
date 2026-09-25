import { useState, useEffect } from 'react';
import { networkStateEngine, NetworkStateInfo } from '@/services/networkState';

export function useNetworkStatus(): NetworkStateInfo {
  const [state, setState] = useState<NetworkStateInfo>(networkStateEngine.getState());

  useEffect(() => {
    const unsubscribe = networkStateEngine.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  return state;
}
