import React, { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "./hub/invoke";

function App() {
  const [provider, setProvider] = useState("http://localhost:3001");
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProvider(e.target.value);

  const [screen, setScreen] = useState("main");

  useEffect(() => {
    const urlParams = window.location.search;
    if (urlParams == "?invoke=asdf") {
      setScreen("test");
    }
  }, []);
  const handleClick = async () => {
    const a = await invoke(provider, "", "", {});
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
