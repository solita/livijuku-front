#!/bin/bash
#node_modules/protractor/bin/protractor --elementExplorer
#npm run teste2e
mvn -q -B -f livijuku-front-e2e-tests/pom.xml test $@
