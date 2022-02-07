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
    browser.runtime.sendMessage({"rows": posts[message.tabId]["rows"]});
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
    browser.browserAction.setBadgeText({text: "" + posts[tabId]["rows"].length});
    browser.browserAction.setBadgeBackgroundColor({color: "#666666"});
    browser.browserAction.setBadgeTextColor({color: "#FFFFFF"});
    browser.browserAction.enable(tabId);
  } else {
    browser.browserAction.setBadgeText({text: ""});
    browser.browserAction.disable(tabId);
  };
}

browser.runtime.onMessage.addListener(handleOnMessage);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.windows.onFocusChanged.addListener(handleWindowFocusChanged);
