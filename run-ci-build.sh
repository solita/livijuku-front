#!/bin/bash
read -r -d '' BUILD_SCRIPT <<- EndOfBuildScript
cd build-job
./ci.sh
EndOfBuildScript

docker run -i --name build-job -v $(pwd):/home/jenkins-slave/build-job sirkkalap/jenkins-swarm-slave-nlm:java7 /bin/bash -c "$BUILD_SCRIPT"

mkdir -p build-job-target
docker cp build-job:/home/jenkins-slave/build-job/target build-job-target
docker stop build-job
docker rm build-job
