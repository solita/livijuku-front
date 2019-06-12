#!/usr/bin/env bash

# if nvm does not exist try to load it from default location
which nvm || source ~/.nvm/nvm.sh

nvm use
rm -rf dist
mkdir dist
./unzip-pdfjs.sh
export NODE_PATH=app/scripts
./node_modules/.bin/gulp

