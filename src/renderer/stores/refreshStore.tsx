import { create } from 'zustand';

type RefreshStore = {
  refreshTime: number;
  triggerRefresh: () => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshTime: 0,
  triggerRefresh: () => set((state) => ({ refreshTime: state.refreshTime + 1 })),
}));
