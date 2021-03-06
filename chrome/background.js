let posts = {};
let allowedHosts = [];
fetchAllowedHosts();

function handleActivated(activeInfo) {
  handleNewTab(activeInfo.tabId);
}

function fetchAllowedHosts() {
  fetch('https://www.nabu.news/sources', {
    mode: 'no-cors'
  }).then((r) => r.json())
  .then((data) => {
    allowedHosts = data.rows.map( item => item.url);
    chrome.storage.local.set({'allowedHosts': allowedHosts});
  });
}

function isAllowedHost(host) {
  if (allowedHosts.length == 0) {
    allowedHosts = chrome.storage.local.get(['allowedHosts'], function(result) {
      allowedHosts = result.allowedHosts;
    });
  };
  return allowedHosts.includes(host);
}

function handleOnMessage(message, sender) {
  if (message.url && isAllowedHost(message.host)) {
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
        postsCache(!posts);
        posts[sender.tab.id] = {"url": message.url, "rows": data.rows};
        chrome.storage.local.set({'posts': posts});
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab.id == sender.tab.id) {
            handleNewTab(tab.id);
          };
        })
    })
    .catch((err) => {
      if(typeof err === 'string') err = new Error(err)
      console.error(err)
    });
  } else if (message.tabId) {
    postsCache(!posts);
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
    if (tab) {
      handleNewTab(tab.id);
    };
  });
}

function handleNewTab(tabId) {
  postsCache(!posts[tabId]);
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

function postsCache(condition) {
  if (condition) {
    chrome.storage.local.get(['posts'], function(result) {
      if (result.posts) {
        posts = result.posts;
      };
    });
  };
}

chrome.runtime.onMessage.addListener(handleOnMessage);
chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onRemoved.addListener(handleRemoved);
chrome.windows.onFocusChanged.addListener(handleWindowFocusChanged);
