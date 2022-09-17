import React, { useState } from "react";
import "./App.css";

function App() {
  const [provider, setProvider] = useState("http://localhost:3001");
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProvider(e.target.value);

  return (
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
    </div>
  );
}

export default App;
