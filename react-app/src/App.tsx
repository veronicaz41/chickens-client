import { useEffect } from "react";
import './App.css';
import useStore from "./hooks/useStore";
import { useGetParam } from "./hooks/useGetParam";
import { useRegister } from "./hooks/useRegister";
import * as wasm from 'chickens-wasm';


function App() {
  const hasHydrated = useStore((state) => state._hasHydrated);
  const userName = "v";
  const userId = useStore((state) => state.userId);
  const setPZClient = useStore((state) => state.setPZClient);

  const { data } = useGetParam();
  const { mutate: register } = useRegister();

  useEffect(() => {
    if (data) {
      const seed = new Uint8Array(data);
      wasm.init(seed);

      register(userName);
    }
  }, [data, register]);

  useEffect(() => {
    if (userId) {
      const pz = wasm.PZClient.new(userId, 4);
      setPZClient(pz);
    }
  }, [userId, setPZClient]);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <p>Chickens</p>
      <p>UserId: {userId}</p>
    </div>
  );
}

export default App;
