import { useEffect } from "react";
import './App.css';
import { useGetParam } from "./queries/useGetParam";
import { setup } from 'chickens-wasm';


function App() {
  const { data } = useGetParam();

  useEffect(() => {
    if (data) {
      let seed = new Uint8Array(data);
      setup(seed);
    }
  }, [data]);

  return (
    <div className="App">
      <p>Chickens</p>
      <p>{data}</p>
    </div>
  );
}

export default App;
