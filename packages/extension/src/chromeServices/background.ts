// @ts-ignore

import { eventTypes } from "../constants/eventTypes";

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 500;

async function openInvoke(uri: string, method: string, args: number[]) {
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

  const url = new URL("file://index.html");
  console.log(uri);
  console.log(method);
  console.log(args);
  url.searchParams.append("uri", encodeURIComponent(uri));
  url.searchParams.append("method", encodeURIComponent(method));
  url.searchParams.append("args", encodeURIComponent(JSON.stringify(args)));

  console.log(url.toString().replace("file://", ""));

  chrome.windows.create({
    url: chrome.runtime.getURL(url.toString().replace("file://", "").replace("/", "")),
    type: "popup",
    height: POPUP_HEIGHT,
    width: POPUP_WIDTH,
    top,
    left,
  });
}

if (chrome?.runtime) {
  // Catch messages from content script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log("REQUEST AS IT COMES FRESH", JSON.stringify(request));

    if (request?.type === eventTypes.openInvoke) {
      console.log("REQUEST", request);
      openInvoke(request?.uri, request?.method, request?.args);
    }

    sendResponse();
  });
}
