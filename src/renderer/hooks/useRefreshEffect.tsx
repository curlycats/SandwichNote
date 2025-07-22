import { useEffect } from 'react';
import { useRefreshStore } from '../stores/refreshStore';

// Auto refresh UI after action. Usually used instead of useEffect if your operation will trigger a UI change
export function useRefreshEffect(effect: () => void, depndencies: any[]) {
  const refreshCount = useRefreshStore((s) => s.refreshTime || 0);

  useEffect(() => {
    effect();
  }, [refreshCount, ...depndencies]);
}
