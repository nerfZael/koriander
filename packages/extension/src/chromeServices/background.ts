// @ts-ignore

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 500;

async function openPopup() {
  let top = 0;
  let left = 0;

  // Try to position popup in top right corner of last focused window
  try {
    const lastFocusedWindow = await chrome.windows.getLastFocused();
    if (
      lastFocusedWindow?.top &&
      lastFocusedWindow?.left &&
      lastFocusedWindow?.width
    ) {
      top = lastFocusedWindow.top;
      left = lastFocusedWindow.left + (lastFocusedWindow.width - POPUP_WIDTH);
    }
  } catch {}

  chrome.windows.create({
    url: chrome.runtime.getURL("index.html?invoke=asdf"),
    type: "popup",
    height: POPUP_HEIGHT,
    width: POPUP_WIDTH,
    top,
    left,
  });
}

if (chrome?.runtime) {
  // Catch messages from content script
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if (request?.type === "koriander-open") {
      openPopup();
    } else if (request?.type === "koriander-invoke") {
      setTimeout(() => {
        fetch("http://localhost:8080/posts").then(() => {
          console.log("Fetch finished.");
        });
      }, 0);
    }

    sendResponse();
  });
}
