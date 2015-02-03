#!/bin/bash -x

# Jos upstream paketit puuttuvat, noudetaan ne
[ -d target/upstream/upstream/juku-db ] || \
    ( \
        mkdir -p target && \
        cd target && \
        wget --quiet http://jenkins.livijuku.solita.fi/job/backend/lastSuccessfulBuild/artifact/*zip*/archive.zip && \
        unzip -qq archive.zip && \
        rm archive.zip && \
        mv archive upstream \
    )

cd target/upstream/upstream/juku-db

DB_CREATE_ID=${JENKINS_DB_ID}_${JOB_NAME}
curl -sS http://juku:juku@letto:50000/juku/juku_users.testing.create_users?username=${DB_CREATE_ID}
DB_URL=letto.solita.fi:1521/ldev.solita.fi \
DB_USER=juku_${DB_CREATE_ID} \
DB_PASSWORD=juku \
lein with-profiles +test-data do clear-db, update-db

cd ../../juku-backend/target

PROPERTIES_FILE=juku.properties
cat > $PROPERTIES_FILE << EofProperties
server.port = 8080
db.url = jdbc:oracle:thin:@letto.solita.fi:1521/ldev.solita.fi
db.user = juku_${DB_CREATE_ID}_app
db.password = juku
EofProperties

(
  cd ../../../..
  ls -la .
  npm install
  bower --allow-root install

  node ./node_modules/protractor/bin/webdriver-manager status
  grunt build
)

KILL_BACKGROUNDS='[ ! -z $BACKEND_PID ] && echo ****** Killing backend PID:$BACKEND_PID && kill -TERM $BACKEND_PID;\
[ ! -z $FRONTEND_PID ] && echo ****** Killing backend PID:$FRONTEND_PID && kill -TERM $FRONTEND_PID'

trap "$KILL_BACKGROUNDS" HUP INT QUIT ABRT KILL SEGV TERM EXIT

java -jar juku.jar&
BACKEND_PID=$!
sleep 30

cd ../../../..
ls -la .
npm run serve-dist&
FRONTEND_PID=$!

node node_modules/protractor/bin/protractor protractor.conf.js --verbose
ps axufww