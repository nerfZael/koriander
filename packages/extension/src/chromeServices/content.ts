import { eventTypes } from "../constants/eventTypes";

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

  // Catch messages from inpage script and others
  window.addEventListener("message", (event) => {
    if (!chrome.runtime?.id || event.source !== window) {
      return;
    }

    const eventType: string = event?.data?.type;
    // Send message to background messages listener
    if (eventType === eventTypes.openInvoke) {
      chrome.runtime.sendMessage({ type: eventTypes.openInvoke }, () => {});
    }
  });
}
