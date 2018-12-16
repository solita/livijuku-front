#!/bin/bash

set -e
rm -rf dist/pdf
cd dist
unzip -qq ../lib/pdf.zip
mv generic pdf

