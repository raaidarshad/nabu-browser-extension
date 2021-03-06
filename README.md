# nabu-browser-extension
Browser extension that lists articles about the same topic as the article you are currently viewing.

[Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/nabu/)
[Chrome extension](https://chrome.google.com/webstore/detail/nabu/bgmcmbjhfdnfaplfiiphlefclhhhnajb)

## Build

Requires node/npm.

### Firefox

From inside the top-level `firefox-svelte` directory, run `npm install` then `npm run build` to create `popup.js` in `firefox/popup` (uses svelte and rollup). The rest of the firefox extension code is under the `firefox` directory, written in plain html/css/js.

From inside the `firefox` directory, run `zip -r -FS ../nabu-firefox.zip * --exclude '*.git*'` to create the zip file to upload (todo: create a super simple script that just runs that command).

### Chrome

From inside the top-level `chrome-svelte` directory, run `npm install` then `npm run build` to create `popup.js` in `chrome/popup` (uses svelte and rollup). The rest of the firefox extension code is under the `chrome` directory, written in plain html/css/js.

From inside the `chrome` directory, run `zip -r -FS ../nabu-chrome.zip * --exclude '*.git*'` to create the zip file to upload (todo: create a super simple script that just runs that command).

## Why is the code separate?
For starters, there are different manifest versions supported/required by Chrome and Firefox. So `manifest.json` for each has to be different, with different fields allowed, with `v3` for Chrome and `v2` for Firefox.

Next, Firefox unpretentiously uses `browser` to access the various APIs needed to make this work, while Google, in their infinite wisdom, make you write `chrome` instead. The APIs are slightly different, too, especially with the introduction of `v3`, so simply using the webextension-polyfill package does not produce working code for Chrome.

Another thing is that Chrome requires service workers, while Firefox allows for background scripts. This extension persists a small amount of data, which is easy to do with a mutating object (a simple `let posts = {}`) in a script, but the service worker architecture requires use of the storage API to persist data in the instances where a service worker idles and loses anything in the global state.

As a result, I found it easier to simply write two seperate extensions. Will this be annoying to update? Yes, as I'll have to update everything twice. Do I want to spend more time getting both to work from the same source code? No, I just want to ship it. Et voila, duplicated code. Thanks, Google, for always looking out for the developer experience.

## Privacy

I hate trackers, targeted ads, etc. I strongly encourage everyone to use ad-blockers, a VPN, and all the other wonderful tools people have made so as to not put up with the shoddy state of many websites. I am entirely okay with websites/services tracking use data, without tracking who is doing the using.

To that end, the only information this extension sends to the nabu.news servers is the URL of the article you are viewing, and it only does so when you are on one of the supported websites (see [here](https://www.nabu.news/blog/sources) for a current list). The servers need that one piece of information to provide you with the list of similar articles.

The only other thing I bother tracking is the user-agent from the HTTP request header, and I really only do that to know if the request is coming from the browser extension on Firefox, on Chrome, or the website itself. That's it.
