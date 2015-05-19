#!/bin/bash
# Lisatty Windows/Cygwin:a varten sulut ja export
(
  export NODE_PATH=app/scripts
  npm install
  export NODE_ENV=production
  npm run build
)
