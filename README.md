# nabu-browser-extension
Browser extension that lists articles about the same topic as the article you are currently viewing.

## Build

Requires node/npm.

From the top-level `popup` directory, run `npm install` then `npm run build-firefox` to create `popup.js` in `firefox/popup` (uses svelte and rollup). The rest of the firefox extension code is under the `firefox` directory, written in plain html/css/js.

Run `zip -r -FS ../nabu-firefox.zip * --exclude '*.git*'` to create the zip file to upload (todo: create a super simple script that just runs that command).