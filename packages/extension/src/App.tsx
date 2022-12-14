import React, { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "./hub/invoke";
import { KorianderRequest } from "./types/request";

function App() {
  const [provider, setProvider] = useState("http://localhost:5137");
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleProviderChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProvider(e.target.value);
    await chrome.storage.local.set({ provider: e.target.value });
  };

  const handleRememberChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRememberChoice(e.target.checked);

  const fetchApprovedUris = async () => {
    return await chrome.storage.local.get("approvedUris");
  };

  const fetchRejectedUris = async () => {
    return await chrome.storage.local.get("rejectedUris");
  };

  const [screen, setScreen] = useState("main");
  const [uri, setUri] = useState("");
  const [method, setMethod] = useState("");
  const [args, setArgs] = useState<number[]>([]);
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    chrome.storage.local.get("provider").then((result) => {
      setProvider(result.provider as string);

      const params = new URL(window.location.toString()).searchParams;
      if (params.get("uri")) {
        setScreen("test");
        const uri = decodeURIComponent(params.get("uri") as string);
        setUri(uri);

        setMethod(decodeURIComponent(params.get("method") as string));
        setArgs(JSON.parse(decodeURIComponent(params.get("args") as string)));
        setRequestId(decodeURIComponent(params.get("requestId") as string));
      }
    });
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
    await chrome.storage.local.set({ requests: [...array] });

    if (rememberChoice) {
      const resultObject = await fetchApprovedUris();
      const approvedUris = resultObject.approvedUris as string[];

      approvedUris.push(uri);

      await chrome.storage.local.set({ approvedUris: [...approvedUris] });
    }

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

    if (rememberChoice) {
      const resultObject = await fetchRejectedUris();
      const rejectedUris = resultObject.rejectedUris as string[];

      rejectedUris.push(uri);

      await chrome.storage.local.set({ rejectedUris: [...rejectedUris] });
    }

    window.close();
  };

  return screen == "main" ? (
    <>
      <header className="h-10 bg-green-600 px-2">
        <h2 className="text-2xl font-semibold text-white">Koriander</h2>
      </header>

      <div className="App flex flex-col gap-4 p-4">
        <main>
          <label
            htmlFor="provider"
            className="block text-sm font-medium text-gray-700"
          >
            Provider
          </label>
          <input
            type="text"
            className="App-input"
            id="provider"
            value={provider}
            onChange={handleProviderChange}
          ></input>
        </main>
      </div>
    </>
  ) : (
    <div className="App flex flex-col gap-4 p-4">
      <div className="space-y-4 text-base text-center">
        <p>Invoking</p>
        <div>
          <p className="font-bold text-gray-800">{uri}</p>
          <p className="text-xs font-mono font-semibold tracking-wide text-gray-500">
            URI
          </p>
        </div>
        <div>
          <p className="font-bold text-gray-800">{method}</p>
          <p className="text-xs font-semibold tracking-wide text-gray-500">
            Method
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-between align-middle">
        <button
          type="button"
          className="App-btn-primary"
          onClick={handleInvoke}
        >
          INVOKE
        </button>
        <button
          type="button"
          className="App-btn-secondary"
          onClick={handleReject}
        >
          REJECT
        </button>
      </div>

      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="comments"
            name="comments"
            type="checkbox"
            onChange={handleRememberChoiceChange}
            checked={rememberChoice}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            Remember this URI
          </label>
          <p id="comments-description" className="text-gray-500">
            Further requests will be automatically invoked or rejected
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
