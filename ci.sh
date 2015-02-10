#!/bin/bash -x

work=$(cd "$(dirname "$0")"; pwd)
upstream="$work/target/upstream"


ensureUpstream() {
  # Jos upstream paketit puuttuvat, noudetaan ne
  if [ ! -d "$upstream/upstream/juku-db" ]; then
    (
      mkdir -p target
      cd target
      wget --quiet http://jenkins.livijuku.solita.fi/job/backend/lastSuccessfulBuild/artifact/*zip*/archive.zip
      unzip -qq archive.zip
      rm archive.zip
      mv archive upstream
    )
  fi
}

createDb() {
  local DB_CREATE_ID=$1
  (
    cd "$upstream"/upstream/juku-db

    curl -sS http://juku:juku@letto.solita.fi:50000/juku/juku_users.testing.create_users?username=${DB_CREATE_ID}
    DB_URL=letto.solita.fi:1521/ldev.solita.fi \
    DB_USER=juku_${DB_CREATE_ID} \
    DB_PASSWORD=juku \
    lein with-profiles +test-data do clear-db, update-db
  )
}

buildFront() {
  (
    cd "$work"
    npm install
    bower --allow-root install --config.interactive=false
    grunt build
  )
}

trapServices() {
  KILL_SERVICES='[ ! -z $BACKEND_PID ] && echo ****** Killing backend PID:$BACKEND_PID && kill -TERM $BACKEND_PID;\
                 [ ! -z $FRONTEND_PID ] && echo ****** Killing backend PID:$FRONTEND_PID && kill -TERM $FRONTEND_PID'

  trap "$KILL_SERVICES" HUP INT QUIT ABRT KILL SEGV TERM EXIT
}

startBackend() {
  local DB_CREATE_ID=$1
  (
    cd "$upstream/juku-backend/target"

    PROPERTIES_FILE=juku.properties
cat > $PROPERTIES_FILE << EofProperties
server.port = 8080
db.url = jdbc:oracle:thin:@letto.solita.fi:1521/ldev.solita.fi
db.user = juku_${DB_CREATE_ID}_app
db.password = juku
EofProperties

    java -jar juku.jar&
    BACKEND_PID=$!
    while ! curl http://localhost:8082/ &>/dev/null; do sleep 1; done
    sleep 3
  )
}

startFront() {
  cd $work
  npm run serve-dist&
  FRONTEND_PID=$!
}

startSelenium () {
    # start selenium
  ./node_modules/protractor/bin/webdriver-manager start > /dev/null 2>&1 &
  SELENIUM_PID=$!

  # wait until selenium is up
  while ! curl http://localhost:4444/wd/hub/status &>/dev/null; do sleep 1; done
}

runTests() {
  # run the build
  grunt citeste2e --force

  # stop selenium nicely
  curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer > /dev/null 2>&1

  sleep 3
}

if [ ! -z $JENKINS_DB_ID ]; then
  DB_CREATE_ID=${JENKINS_DB_ID}_${JOB_NAME}
else
  DB_CREATE_ID=${USER}_front
fi

ensureUpstream
buildFront
createDb $DB_CREATE_ID
trapServices
startBackend $DB_CREATE_ID
startFront
startSelenium
runTests

eval $KILL_SERVICES

