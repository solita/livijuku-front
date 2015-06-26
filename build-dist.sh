#!/bin/bash
# Lisatty Windows/Cygwin:a varten sulut ja export
(
  export NODE_PATH=app/scripts
  npm install
  npm prune
  export NODE_ENV=production
  rm -rf dist
  npm run build
)
