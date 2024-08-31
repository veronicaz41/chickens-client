import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  user: any | null;
  setUser: (userId: any | null) => void;

  pzClient: any | null;
  setPZClient: (pzClient: any | null) => void;
}

const useStore = create<State>()(
  devtools(
    immer((set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),

      pzClient: null,
      setPZClient: (pzClient) => set(() => ({ pzClient })),
    })),
    {
      name: "Store",
    }
  )
);

export default useStore;
