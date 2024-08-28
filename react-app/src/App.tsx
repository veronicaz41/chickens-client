import { useEffect } from "react";
import './App.css';
import { useGetParam } from "./queries/useGetParam";
import { setup } from "chickens-wasm";


function App() {
  const param = useGetParam();


  useEffect(() => {
    setup(param.data);
  });

  return (
    <div className="App">
      <p>Chickens</p>
    </div>
  );
}

export default App;
