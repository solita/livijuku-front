#!/bin/bash

work=$(cd "$(dirname "$0")"; pwd)
upstream="$work/target/upstream"


fetchUpstreamArtifacts () {
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
    npm install node-sass
    npm install
    bower --allow-root install --config.interactive=false
    grunt build
  )
}

trapServices() {

  # Muuttujat evaluioidaan vasta kutsuttaessa. Tässä vaiheessa niillä ei vielä ole järkeviä arvoja
  STOP_SERVICES='curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer >/dev/null 2>&1;
    if [ ! -z "$FRONTEND_PID" ]; then
       echo "Stopping frontend. ($FRONTEND_PID)";
       kill -TERM $FRONTEND_PID;
    fi;
    if [ ! -z "$BACKEND_PID"  ]; then
       echo "Stopping backend. ($BACKEND_PID)";
       kill -TERM $BACKEND_PID;
    fi;
    exit 1'

  trap "$STOP_SERVICES" HUP INT QUIT ABRT KILL SEGV TERM EXIT
}

createBackendPropertiesFile () {

local DB_CREATE_ID=$1
local properties_file=$2

cat > $properties_file << EofProperties
server.port = 8080
db.url = jdbc:oracle:thin:@letto.solita.fi:1521/ldev.solita.fi
db.user = juku_${DB_CREATE_ID}_app
db.password = juku
EofProperties

}

runTests() {
  # run the build
  grunt citeste2e --force
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

cd "$upstream/juku-backend/target"
createBackendPropertiesFile $DB_CREATE_ID juku.properties

# Käynnistä backend palvelin.
java -jar juku.jar &
BACKEND_PID=$!

# Odota, kunnes backend vastaa.
while ! curl http://localhost:8082/ &>/dev/null; do sleep 1; done
sleep 3

# Käynnistä front-palvelin.
cd $work
node ./serve-dist.js &
FRONTEND_PID=$!

# Käynnistä selenium
./node_modules/protractor/bin/webdriver-manager start > /dev/null 2>&1 &

# Odota, kunnes selenium vastaa
while ! curl http://localhost:4444/wd/hub/status &>/dev/null; do sleep 1; done

runTests

read -p "Press [Enter] key to stop"

# Sammuta palvelut
eval $STOP_SERVICES
