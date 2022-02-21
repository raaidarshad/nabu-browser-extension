#!/usr/bin/env bash

cd firefox && zip -r -FS ../nabu-firefox.zip * --exclude '*.git*'
cd ..
cd chrome && zip -r -FS ../nabu-chrome.zip * --exclude '*.git*'
cd ..