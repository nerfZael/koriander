import { eventTypes } from "../constants/eventTypes";
import { msgpackEncode } from "@polywrap/msgpack-js";

const apiObject = {
  invoke: (uri: string, method: string, args: Record<string, unknown>) => {
    // Send message to content script event listener
    const messageObj = {
      type: eventTypes.openInvoke,
      uri: uri,
      method: method,
      args: [...msgpackEncode(args)],
      origin: window.location.origin
    };

    console.log("MessageObj", messageObj);
    console.log(window.location.origin);
    window.postMessage(messageObj, window.location.origin);

    return new Promise((resolve) => {
      const resolveIfInvokeResultMessage = (event: MessageEvent) => {
        const eventType: string = event?.data?.type;
        if (eventType === eventTypes.invokeResult) {
          console.log("EVENT IN INJECT", event);
          window.removeEventListener("message", resolveIfInvokeResultMessage);
          resolve(event?.data?.result);
        }
      };

      window.addEventListener("message", resolveIfInvokeResultMessage);
    });
  },
};

(window as Record<string, any>).koriander = apiObject;

export {};
