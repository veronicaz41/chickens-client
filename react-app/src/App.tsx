import { useEffect, useState } from "react";
import './App.css';
import useStore from "./hooks/useStore";
import { useGetParam } from "./hooks/useGetParam";
import { useRegister } from "./hooks/useRegister";
import * as wasm from 'chickens-5';


function App() {
  const [serverKeyShare, setServerKeyShare] = useState(null);
  const userName = "v";
  const user = useStore((state) => state.user);
  const pzClient = useStore((state) => state.pzClient);
  const setPZClient = useStore((state) => state.setPZClient);

  const { data } = useGetParam();
  const { mutate: register } = useRegister();

  useEffect(() => {
    if (user === null) {
      console.log("register user");
      register(userName);
    }
  }, [user, register]);

  useEffect(() => {
    if (pzClient === null && data && user) {
      console.log("call wasm PZClient.new");
      const seed = new Uint8Array(data);
      const pz = wasm.PZClient.new(seed);
      setPZClient(pz);
    }
  }, [pzClient, data, user, setPZClient]);

  useEffect(() => {
    if (serverKeyShare === null && pzClient) {
      console.log("call wasm PZClient gen_key_share");
      let sks = pzClient.gen_server_key_share(user.id, 4);
      setServerKeyShare(sks);
    }
  }, [pzClient, serverKeyShare, setServerKeyShare]);

  return (
    <div className="App">
      <p>Chickens</p>
      <p>User: {user?.id}</p>
    </div>
  );
}

export default App;
