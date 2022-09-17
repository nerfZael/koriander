import { eventTypes } from "../constants/eventTypes";

const apiObject = {
  invoke: (uri: string, method: string, args: Record<string, unknown>) => {
    // Send message to content script event listener
    window.postMessage({ type: eventTypes.openInvoke }, window.location.origin);
  },
};

(window as Record<string, any>).koriander = apiObject;

export {};
