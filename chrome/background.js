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
    chrome.runtime.sendMessage(posts[message.tabId]);
  } else {
    handleRemoved(sender.tab.id);
    chrome.action.setBadgeText({text: ""});
    chrome.action.disable(sender.tab.id);
  }
}

function handleRemoved(tabId) {
  delete posts[tabId];
}

function handleWindowFocusChanged(windowId) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    handleNewTab(tab.id);
  });
}

function handleNewTab(tabId) {
  if(posts[tabId]) {
    // not sure about JS safety here, so using two separate if statements
    if (posts[tabId]['rows'].length > 0) {
      chrome.action.setBadgeText({text: "" + posts[tabId]['rows'].length});
      chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
      chrome.action.enable(tabId);
    } else {
      chrome.action.setBadgeText({text: ""});
    };
  } else {
    chrome.action.setBadgeText({text: ""});
    chrome.action.disable(tabId);
  };
}

chrome.runtime.onMessage.addListener(handleOnMessage);
chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onRemoved.addListener(handleRemoved);
chrome.windows.onFocusChanged.addListener(handleWindowFocusChanged);
