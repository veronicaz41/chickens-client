import { useEffect } from "react";
import './App.css';
import { useGetParam } from "./queries/useGetParam";
import { add } from 'chickens-wasm';


function App() {
  const param = useGetParam();


  useEffect(() => {
    // setup(param.data);
    add(1, 1);
  }, []);

  return (
    <div className="App">
      <p>Chickens</p>
    </div>
  );
}

export default App;
