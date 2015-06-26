#!/bin/bash
(
  export NODE_PATH=app/scripts
  export NODE_ENV=test
  ./node_modules/.bin/mocha app/scripts/**/__tests__/**/*.js
)
