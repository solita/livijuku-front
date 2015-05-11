#!/bin/bash
# Lisatty Windows/Cygwin:a varten sulut ja export
(
  export NODE_PATH=app/scripts
  export NODE_ENV=production
  npm install
  npm run build
)
