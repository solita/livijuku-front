#!/usr/bin/env bash
#node_modules/protractor/bin/protractor --elementExplorer
#npm run teste2e
cd livijuku-front-e2e-tests
./mvnw -q -B clean test $@
