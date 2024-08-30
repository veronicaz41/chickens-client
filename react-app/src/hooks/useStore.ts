import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  userId: number | null;
  setUserId: (userId: number | null) => void;

  pzClient: any | null;
  setPZClient: (pzClient: any | null) => void;
}

const useStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },

        userId: null,
        setUserId: (userId) => set(() => ({ userId })),

        pzClient: null,
        setPZClient: (pzClient) => set(() => ({ pzClient })),
      })),
      {
        name: "Store",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        }
      }
    )
  )
);

export default useStore;
