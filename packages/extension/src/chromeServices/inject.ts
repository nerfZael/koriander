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
    };

    console.log("MessageObj", messageObj);

    window.postMessage(messageObj, window.location.origin);
  },
};

(window as Record<string, any>).koriander = apiObject;

export {};
