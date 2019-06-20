#!/bin/bash
(
  export NODE_PATH=app/scripts:tests
  export NODE_ENV=test
  ./node_modules/.bin/mocha -r esm app/scripts/**/__tests__/**/*.js --full-trace $@
)
