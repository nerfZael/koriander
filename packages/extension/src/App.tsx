import React, { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "./hub/invoke";

function App() {
  const [provider, setProvider] = useState("http://localhost:5137");
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProvider(e.target.value);

  const [screen, setScreen] = useState("main");
  const [uri, setUri] = useState("");
  const [method, setMethod] = useState("");
  const [args, setArgs] = useState<number[]>([]);

  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams;
    console.log(params);
    console.log(window.location.toString());
    if (params.get("uri")) {
      setScreen("test");

      setUri(decodeURIComponent(params.get("uri") as string));
      setMethod(decodeURIComponent(params.get("method") as string));
      setArgs(JSON.parse(decodeURIComponent(params.get("args") as string)));

      console.log(decodeURIComponent(params.get("uri") as string));
      console.log(decodeURIComponent(params.get("method") as string));
      console.log(JSON.parse(decodeURIComponent(params.get("args") as string)));
    }
  }, []);

  const handleClick = async () => {
    const a = await invoke(provider, uri, method, args);
    console.log(a);
    alert("Check it");
    window.close();
  };

  return screen == "main" ? (
    <div className="App">
      <header className="h-10 bg-green-700 px-2">
        <h2 className="text-2xl font-semibold text-white">Koriander</h2>
      </header>
      <main>
        <input
          type="text"
          className="App-input"
          value={provider}
          onChange={handleProviderChange}
        ></input>
      </main>
      <footer>
        <p className="text-sm text-gray-500">Current provider: {provider}</p>
      </footer>
    </div>
  ) : (
    <div className="App">
      <button type="button" onClick={handleClick}>
        INVOKE
      </button>
    </div>
  );
}

export default App;
