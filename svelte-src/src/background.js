import browser from "webextension-polyfill";

let posts = {};

function handleActivated(activeInfo) {

  handleNewTab(activeInfo.tabId);
}

function handleOnMessage(message, sender) {

  if (message.url) {
    const inputUrl = new URL(message.url);
    fetch('https://www.nabu.news/submitSearch', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target: inputUrl })
    }).then((r) => r.json())
    .then((data) => {
        posts[sender.tab.id] = {"url": message.url, "rows": data.rows};
        handleNewTab(sender.tab.id);
    })
    .catch((err) => {
      if(typeof err === 'string') err = new Error(err)
      console.error(err)
    });
  } else if (message.tabId) {
    browser.runtime.sendMessage(posts[message.tabId]);
  } else {
    handleRemoved(sender.tab.id);
    browser.browserAction.setBadgeText({text: ""});
    browser.browserAction.disable(sender.tab.id);
  }
}

function handleRemoved(tabId) {
  delete posts[tabId];
}

function handleWindowFocusChanged(windowId) {
  browser.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    handleNewTab(tab.id);
  });
}

function handleNewTab(tabId) {
  if(posts[tabId]) {
    // not sure about JS safety here, so using two separate if statements
    if (posts[tabId]['rows'].length > 0) {
      browser.browserAction.setBadgeText({text: "" + posts[tabId]['rows'].length});
      browser.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
      browser.browserAction.setBadgeTextColor({color: '#FFFFFF'});
      browser.browserAction.enable(tabId);
    } else {
      browser.browserAction.setBadgeText({text: ""});
    };
  } else {
    browser.browserAction.setBadgeText({text: ""});
    browser.browserAction.disable(tabId);
  };
}

browser.runtime.onMessage.addListener(handleOnMessage);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
