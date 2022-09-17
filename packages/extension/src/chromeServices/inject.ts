const apiObject = {
  hello: () => {
    return "Hello";
  },
  open: () => {
    // Send message to content script event listener
    window.postMessage(
      { type: "koriander-open", text: "Show Koriander popup" },
      window.location.origin
    );
  },
};

(window as Record<string, any>).koriander = apiObject;

export {};
