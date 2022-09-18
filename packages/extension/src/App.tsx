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

  const handleClick = async () => {
    const invokeResult = await invoke(provider, uri, method, args);
    console.log(invokeResult);

    // const messageObj = {
    //   type: eventTypes.invokeResult,
    //   result: invokeResult,
    // };

    chrome.storage.local.get("requests", (getResult) => {
      console.log(getResult);
      const array = getResult.requests as KorianderRequest[];

      const request = array.find((x) => x.id === requestId);
      if (request) {
        request.response = invokeResult;
      }

      chrome.storage.local.set({ requests: array });
    });
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   console.log("TABS", tabs);
    //   console.log(tabs[0].id as number);
    //   chrome.tabs.sendMessage((tabs[0].id as number), messageObj, () => {});
    // });

    // chrome.runtime.sendMessage(
    //   messageObj,
    //   () => {}
    // );

    // alert("Check it");

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
