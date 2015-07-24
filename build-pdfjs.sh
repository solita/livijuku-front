#!/bin/bash
(
  git clone https://github.com/mozilla/pdf.js.git
  cd pdf.js
  npm install
  node make generic
  cd ..
  mkdir -p dist/
  cp -r pdf.js dist/pdf
)
