import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  user: any | null;
  setUser: (userId: any | null) => void;
}

const useStore = create<State>()(
  devtools(
      immer((set) => ({
        user: null,
        setUser: (user) => set(() => ({ user })),
      })),
      {
        name: "Store",
      }
    )
);

export default useStore;
