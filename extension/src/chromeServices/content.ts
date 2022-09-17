console.log("Test successful!");

var s = document.createElement('script');
s.src = chrome.runtime.getURL('static/js/inject.js');
(document.head || document.documentElement).appendChild(s);
