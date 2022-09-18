import React, { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "./hub/invoke";
import { KorianderRequest } from "./types/request";

function App() {
  const [provider, setProvider] = useState("http://localhost:5137");
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProvider(e.target.value);

  const [screen, setScreen] = useState("main");
  const [uri, setUri] = useState("");
  const [method, setMethod] = useState("");
  const [args, setArgs] = useState<number[]>([]);
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams;
    console.log(params);
    console.log(window.location.toString());
    if (params.get("uri")) {
      setScreen("test");

      setUri(decodeURIComponent(params.get("uri") as string));
      setMethod(decodeURIComponent(params.get("method") as string));
      setArgs(JSON.parse(decodeURIComponent(params.get("args") as string)));
      setRequestId(decodeURIComponent(params.get("requestId") as string));

      console.log(decodeURIComponent(params.get("requestId") as string));
    }
  }, []);

  const handleInvoke = async () => {
    const invokeResult = await invoke(provider, uri, method, args);
    console.log("invokeResult", invokeResult);

    const getResult = await chrome.storage.local.get("requests");
    console.log("getResult", getResult);

    const array = getResult.requests as KorianderRequest[];

    const request = array.find((x) => x.id === requestId);
    if (request) {
      request.response = invokeResult;
    }

    console.log("array", array);
    chrome.storage.local.set({ requests: [...array] });

    window.close();
  };

  const handleReject = async () => {
    const getResult = await chrome.storage.local.get("requests");
    console.log(getResult);
    const array = getResult.requests as KorianderRequest[];

    const request = array.find((x) => x.id === requestId);
    if (request) {
      request.response = { data: null, error: "REJECTED_BY_USER" };
    }

    await chrome.storage.local.set({ requests: array });

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
      <button type="button" onClick={handleInvoke}>
        INVOKE
      </button>
      <button type="button" onClick={handleReject}>
        REJECT
      </button>
    </div>
  );
}

export default App;
