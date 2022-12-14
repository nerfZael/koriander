// @ts-ignore

import { eventTypes } from "../constants/eventTypes";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ provider: ["http://localhost:5137"] });
  console.log("Requests reset");
  chrome.storage.local.set({ requests: [] });
  console.log("Requests reset");
  chrome.storage.local.set({ approvedUris: [] });
  console.log("Approved URIs reset");
  chrome.storage.local.set({ rejectedUris: [] });
  console.log("Rejected URIs reset");
});

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 350;

async function openInvoke(
  uri: string,
  method: string,
  args: number[],
  requestId: string
) {
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
  url.searchParams.append("uri", encodeURIComponent(uri));
  url.searchParams.append("method", encodeURIComponent(method));
  url.searchParams.append("args", encodeURIComponent(JSON.stringify(args)));
  url.searchParams.append("requestId", encodeURIComponent(requestId));

  await chrome.windows.create({
    url: chrome.runtime.getURL(
      url.toString().replace("file://", "").replace("/", "")
    ),
    type: "popup",
    height: POPUP_HEIGHT,
    width: POPUP_WIDTH,
    top,
    left,
  });

  const getResult = await chrome.storage.local.get("requests");
  await chrome.storage.local.set({
    requests: [...getResult.requests, { id: requestId }],
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
      openInvoke(
        request?.uri,
        request?.method,
        request?.args,
        request?.requestId
      );
      sendResponse();
    }
  });
}
