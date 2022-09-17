console.log("Test successful!");

var s = document.createElement('script');
s.src = chrome.runtime.getURL('static/js/inject.js');
(document.head || document.documentElement).appendChild(s);

document.addEventListener('korianderExt_test', function(e) {
  // e.detail contains the transferred data (can be anything, ranging
  // from JavaScript objects to strings).
  // Do something, for example:
  alert((e as CustomEvent<string>).detail);
})