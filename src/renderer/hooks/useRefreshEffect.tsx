import { useEffect } from 'react';
import { useRefreshStore } from '../stores/refreshStore';

export function useRefreshEffect(effect: () => void, depndencies: any[]) {
  const refreshCount = useRefreshStore((s) => s.refreshTime || 0);

  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount, ...depndencies]);
}
