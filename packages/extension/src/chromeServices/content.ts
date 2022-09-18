import { eventTypes } from "../constants/eventTypes";
import { v4 as uuid } from "uuid";
import { KorianderRequest } from "../types/request";
import { invoke } from "../hub/invoke";

// @ts-ignore
function injectAPIIntoWindow() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");

    scriptTag.async = false;
    scriptTag.src = chrome.runtime.getURL("static/js/inject.js");

    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error("Koriander: Provider injection failed.", error);
  }
}

if (chrome?.runtime) {
  injectAPIIntoWindow();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const type = message?.type;
    console.log("content onMessage", message);
    if (type === eventTypes.invokeResult) {
      console.log("invoke result message", message);
      console.log(window.location.origin);
      window.postMessage(message, message.origin);
      sendResponse();
    }
  });

  console.log("added listener");

  // Catch messages from inpage script and others
  window.addEventListener("message", async (event) => {
    if (!chrome.runtime?.id || event.source !== window) {
      return;
    }

    const eventType: string = event?.data?.type;
    // Send message to background messages listener
    if (eventType === eventTypes.openInvoke) {
      //if approved, invoke
      const fetchApprovedUris = async () => {
        const result = await chrome.storage.local.get("approvedUris");
        const approvedUris = result.approvedUris as string[];
        return approvedUris;
      };
      const fetchRejectedUris = async () => {
        const result = await chrome.storage.local.get("rejectedUris");
        const rejectedUris = result.rejectedUris as string[];
        return rejectedUris;
      };
      const fetchProvider = async () => {
        const result = await chrome.storage.local.get("provider");
        const provider = result.provider as string;
        return provider;
      };
      const uri = event?.data?.uri as string;
      const method = event?.data?.method as string;
      const args = event?.data?.args as number[];

      console.log("WILL THIS BE THE URI?", uri);
      const approvedUris = await fetchApprovedUris();

      if (approvedUris.includes(uri)) {
        const provider = await fetchProvider();

        const result = await invoke(provider, uri, method, args);
        console.log(result);
        window.postMessage({
          type: eventTypes.invokeResult,
          result: result,
        });

        return;
      }

      const rejectedUris = await fetchRejectedUris();

      if (rejectedUris.includes(uri)) {
        window.postMessage({
          type: eventTypes.invokeResult,
          result: {
            data: null,
            error: "REJECTED_BY_USER",
          },
        });
        return;
      }

      //else UI
      const requestId = uuid().toString();

      chrome.runtime.sendMessage(
        {
          type: eventTypes.openInvoke,
          uri: event?.data?.uri,
          method: event?.data?.method,
          args: event?.data?.args,
          requestId: requestId,
        },
        () => {}
      );

      const listener = async (objects: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        let newArray: KorianderRequest[] = [];
        try {
          const resultObject = await chrome.storage.local.get("requests");

          newArray = resultObject.requests as KorianderRequest[];
        } catch {}

        const request = newArray.find((x) => x.id === requestId);

        if (request && request.response) {
          const res = await chrome.storage.local.get("requests");
          const array = res.requests as KorianderRequest[];
          const requestToRemove = array.find((x) => x.id === requestId);

          if (requestToRemove) {
            array.splice(array.indexOf(requestToRemove), 1);
          }

          await chrome.storage.local.set({ requests: array });

          window.postMessage({
            type: eventTypes.invokeResult,
            result: request.response,
          });

          chrome.storage.local.onChanged.removeListener(listener);
        }
      };

      chrome.storage.local.onChanged.addListener(listener);
    }
  });
}
