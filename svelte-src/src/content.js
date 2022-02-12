import browser from "webextension-polyfill";

// todo consider pulling these from DB in some way so it auto-updates as the db does (would need caching)
const tlds = [
    "www.nytimes.com",
    "www.foxnews.com",
    "jacobinmag.com",
    "www.npr.org",
    "www.breitbart.com",
    "www.newsmax.com",
    "www.oann.com",
    "www.reuters.com",
    "www.theguardian.com",
    "theintercept.com",
    "www.wsj.com",
    "www.washingtontimes.com",
    "www.vox.com"
];

if (tlds.includes(window.location.host)) {
    browser.runtime.sendMessage({"url": window.location.href});
} else {
    browser.runtime.sendMessage({"url": ""})
}
