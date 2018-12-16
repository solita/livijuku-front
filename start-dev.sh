#!/bin/bash

rm -rf dist
mkdir dist
./unzip-pdfjs.sh
export NODE_PATH=app/scripts
./node_modules/.bin/gulp

