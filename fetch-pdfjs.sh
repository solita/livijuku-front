#!/bin/bash
(
  set +o noclobber
  curl -sSL -o- http://jenkins.livijuku.solita.fi/job/pdfjs/lastSuccessfulBuild/artifact/build/generic/*zip*/generic.zip >generic.zip
  rm -rf dist/pdf dist/generic
  cd dist
  unzip -qq ../generic.zip
  mv generic pdf
)
