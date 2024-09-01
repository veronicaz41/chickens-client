import {  useEffect, useState } from "react";
import './App.css';
import useStore from "./hooks/useStore";
import { useGetParam } from "./hooks/useGetParam";
import { useRegister } from "./hooks/useRegister";
import * as wasm from 'chickens-wasm';


function App() {
  const [pzClient, setPZClient] = useState<any>(null);
  const [serverKeyShare, setServerKeyShare] = useState(null);

  const userName = "v";
  const user = useStore((state) => state.user);

  const { data: param } = useGetParam();
  const { mutate: register } = useRegister();

  useEffect(() => {
    if (user === null) {
      console.log("register user");
      register(userName);
    }
  }, [user, register]);

  useEffect(() => {
    if (pzClient === null && param && user) {
      console.time("init_web time");
      const seed = new Uint8Array(param);
      const pz = wasm.PZClient.new(seed);
      console.timeEnd("init_web time");
      setPZClient(pz);
    }
  }, [pzClient, param, user, setPZClient]);

  useEffect(() => {
    if (serverKeyShare === null && pzClient) {
      console.time("gen_server_key_share time");
      let sks = pzClient?.gen_server_key_share(user.id, 4);
      console.timeEnd("gen_server_key_share time");
      console.log(sks);
      setServerKeyShare(sks);
    }
  }, [pzClient, user, serverKeyShare, setServerKeyShare]);

  return (
    <div className="App">
      <p>Chickens</p>
      <p>User: {user?.id}</p>
    </div>
  );
}

export default App;
