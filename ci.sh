#!/bin/bash

set -e

WORK=$(cd "$(dirname "$0")"; pwd)
RC=1 # Return code on 1, koska jos tapahtuu poikkeus halutaan exit 1

##DEBUG_REDIRECT=/dev/stdout
DEBUG_REDIRECT=${DEBUG_REDIRECT:-/dev/null}
DB_HTTP_USER_SERVICE=${DB_HTTP_USER_SERVICE:-http://juku:juku@letto.solita.fi:50000}

if [ ! -z "$JENKINS_DB_ID" ]; then
  DB_CREATE_ID=${JENKINS_DB_ID}_${JOB_NAME}
else
  DB_CREATE_ID=${USER}_front
fi

DB_HTTP_RESTORE_SERVICE=${DB_HTTP_RESTORE_SERVICE:-"http://juku_${DB_CREATE_ID}:juku@letto.solita.fi:50000/juku/"}

fetchUpstreamArtifacts () {
  # Jos upstream paketit puuttuvat, noudetaan ne
  if [ ! -d "$WORK/upstream/upstream/juku-db" ]; then
    (
      cd "$WORK"
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
    curl -sS ${DB_HTTP_USER_SERVICE}/juku/juku_users.testing.create_users?username=${DB_CREATE_ID}

    export DB_URL=letto.solita.fi:1521/ldev.solita.fi
    export DB_USER=juku_${DB_CREATE_ID}
    export DB_PASSWORD=juku
    cd $WORK/upstream/upstream/juku-db/target
    echo "Clear-db saattaa kaatua virheeseen:"
    echo " ORA-14452: jo käytössä olevan väliaikaisen taulun indeksiä yritettiin luoda, muuttaa tai poistaa"
    echo ", mutta updaten pitäisi silti onnistua nyt.
    java -jar juku-db.jar clear-db
    java -jar juku-db.jar update-db
  )
}

buildFront() {
  (
    cd "$WORK"
    ./build-dist.sh
  )
}

trapServices() {

  # Muuttujat evaluioidaan vasta kutsuttaessa. Tässä vaiheessa niillä ei vielä ole järkeviä arvoja.
  # Siksi siis yksinkertaiset hipsut literaalin ympärillä.
  STOP_SERVICES='curl -sSLv http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer >$DEBUG_REDIRECT 2>&1;
    if [ ! -z "$FRONTEND_PID" ]; then
       echo "Stopping frontend. ($FRONTEND_PID)";
       kill -TERM $FRONTEND_PID;
    fi;
    if [ ! -z "$BACKEND_PID"  ]; then
       echo "Stopping backend. ($BACKEND_PID)";
       kill -TERM $BACKEND_PID;
    fi;
    exit $RC'

  trap "$STOP_SERVICES" HUP INT QUIT ABRT KILL SEGV TERM EXIT
}

createBackendPropertiesFile () {

local DB_CREATE_ID=$1
local properties_file=$2

cat > $properties_file << EofProperties
server.port = 8082
db.url = jdbc:oracle:thin:@letto.solita.fi:1521/ldev.solita.fi
db.user = juku_${DB_CREATE_ID}_app
db.password = juku
EofProperties

}

runTests() {
  # run the tests
  ./teste2e.sh "-Doraclews.url=$1"
}

fetchUpstreamArtifacts

buildFront

createDb $DB_CREATE_ID

# Rekisteröi palveluiden sammutus keskeytyksien varalle
trapServices

cd "$WORK/upstream/juku-backend/target"
createBackendPropertiesFile $DB_CREATE_ID juku.properties

# Käynnistä backend palvelin.
java -jar juku.jar >"$WORK/backend.out" 2>&1 &
BACKEND_PID=$!

# Odota, kunnes backend vastaa.
while ! curl http://localhost:8082/ >$DEBUG_REDIRECT 2>&1; do sleep 1; done
sleep 3

# Käynnistä front-palvelin.
cd $WORK
./node_modules/.bin/gulp server >"$WORK/frontend.out" &
FRONTEND_PID=$!

# Odota, kunnes front vastaa.
while ! curl http://localhost:9000/ >$DEBUG_REDIRECT 2>&1; do sleep 1; done
sleep 3

# Käynnistä selenium
./node_modules/protractor/bin/webdriver-manager start >$DEBUG_REDIRECT 2>&1 &

# Odota, kunnes selenium vastaa
while ! curl -sSLvi http://localhost:4444/wd/hub/status 2>&1; do sleep 1; done

set +e
runTests $DB_HTTP_RESTORE_SERVICE

sleep 10

RC=0 # Ei poikkeuksia, ok.
