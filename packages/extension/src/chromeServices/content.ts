import { eventTypes } from "../constants/eventTypes";
import { v4 as uuid } from "uuid";
import { KorianderRequest } from "../types/request";

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
  window.addEventListener("message", (event) => {
    if (!chrome.runtime?.id || event.source !== window) {
      return;
    }

    const eventType: string = event?.data?.type;
    // Send message to background messages listener
    if (eventType === eventTypes.openInvoke) {
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

      const listener = (objects: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        const newArray = objects["requests"].newValue as KorianderRequest[];
        console.log("NEW ARRAY", newArray);
        const request = newArray.find((x) => x.id === requestId);

        if (request && request.response) {
          chrome.storage.local.get("requests").then((res) => {
            const array = res.requests as KorianderRequest[];
            const requestToRemove = array.find((x) => x.id === requestId);

            if (requestToRemove) {
              array.splice(array.indexOf(requestToRemove), 1);
            }
          });

          window.postMessage({
            type: eventTypes.invokeResult,
            result: request.response
          });
          chrome.storage.local.onChanged.removeListener(listener);
        }
      };

      chrome.storage.local.onChanged.addListener(listener);
    }
  });
}
