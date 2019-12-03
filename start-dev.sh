#!/usr/bin/env bash

# if nvm does not exist try to load it from default location
which nvm || source ~/.nvm/nvm.sh

nvm use
rm -rf dist
mkdir dist
export NODE_PATH=app/scripts
./node_modules/.bin/gulp

