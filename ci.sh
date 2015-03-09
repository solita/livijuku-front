#!/bin/bash -x

set -e

work=$(cd "$(dirname "$0")"; pwd)
RC=1 # Return code on 1, koska jos tapahtuu poikkeus halutaan exit 1

fetchUpstreamArtifacts () {
  # Jos upstream paketit puuttuvat, noudetaan ne
  if [ ! -d "$work/upstream/upstream/juku-db" ]; then
    (
      cd "$work"
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
    curl -sS http://juku:juku@letto.solita.fi:50000/juku/juku_users.testing.create_users?username=${DB_CREATE_ID}

    export DB_URL=letto.solita.fi:1521/ldev.solita.fi
    export DB_USER=juku_${DB_CREATE_ID}
    export DB_PASSWORD=juku
    cd $work/upstream/upstream/juku-db/target
    java -jar juku-db.jar clear-db
    java -jar juku-db.jar update-db
  )
}

buildFront() {
  (
    cd "$work"
    npm install
    bower install
    grunt build
  )
}

trapServices() {

  # Muuttujat evaluioidaan vasta kutsuttaessa. Tässä vaiheessa niillä ei vielä ole järkeviä arvoja.
  # Siksi siis yksinkertaiset hipsut literaalin ympärillä.
  STOP_SERVICES='curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer >/dev/null 2>&1;
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
  npm run citeste2e
}

if [ ! -z "$JENKINS_DB_ID" ]; then
  DB_CREATE_ID=${JENKINS_DB_ID}_${JOB_NAME}
else
  DB_CREATE_ID=${USER}_front
fi

fetchUpstreamArtifacts

buildFront

createDb $DB_CREATE_ID

# Rekisteröi palveluiden sammutus keskeytyksien varalle
trapServices

cd "$work/upstream/juku-backend/target"
createBackendPropertiesFile $DB_CREATE_ID juku.properties

# Käynnistä backend palvelin.
java -jar juku.jar >backend.out &
BACKEND_PID=$!

# Odota, kunnes backend vastaa.
while ! curl http://localhost:8082/ >/dev/null 2>&1; do sleep 1; done
sleep 3

# Käynnistä front-palvelin.
cd $work
node ./serve-dist.js >front.out &
FRONTEND_PID=$!

# Odota, kunnes front vastaa.
while ! curl http://localhost:9000/ >/dev/null 2>&1; do sleep 1; done
sleep 3

# Käynnistä selenium
./node_modules/protractor/bin/webdriver-manager start >/dev/null 2>&1 &

# Odota, kunnes selenium vastaa
while ! curl -sSLvi http://localhost:4444/wd/hub/status >/dev/null 2>&1; do sleep 1; done

set +e
runTests

sleep 3

RC=0 # Ei poikkeuksia, ok.
