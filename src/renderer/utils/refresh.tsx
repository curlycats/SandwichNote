import { useRefreshStore } from '../stores/refreshStore';

// An action to refresh the UI
const refreshUI = () => {
  useRefreshStore.getState().triggerRefresh();
  return null;
};

export default refreshUI;
