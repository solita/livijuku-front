#!/usr/bin/env bash
set -e

# if nvm does not exist try to load it from default location
which nvm || source ~/.nvm/nvm.sh

nvm use
export NODE_PATH=app/scripts
npm install
npm prune
export NODE_ENV=production
rm -rf dist
npm run build

