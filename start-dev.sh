#!/bin/bash
# Lisatty Windows/Cygwin:a varten sulut ja export
(
  rm -rf dist
  ./fetch-pdfjs.sh
  export NODE_PATH=app/scripts
  ./node_modules/.bin/gulp
)
