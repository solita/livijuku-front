#!/bin/bash

PROJECT=livijuku-front-build
read -r -d '' SCRIPT <<- End
    cd build-job
    eval ./ci.sh
End

IMG=sirkkalap/jenkins-swarm-slave-nlm:java8
MOUNT="-v $(pwd):/home/jenkins-slave/$PROJECT"
ENVS="-e "USER=$USER""

# Käytä build-job-volume:n volumeja, jos sellainen löytyy
build_vol=$(docker ps -a | grep $PROJECT-volume | cut -d ' ' -f1)
if [ ! -z $build_vol ]; then
    build_vol="--volumes-from $build_vol"
fi

docker rm -f $PROJECT 2>/dev/null
docker run -i --name $PROJECT $build_vol $ENVS $MOUNT $IMG /bin/bash #-c "$SCRIPT"

exit 1

mkdir -p $PROJECT-target
docker cp $PROJECT:/home/jenkins-slave/$PROJECT/target $PROJECT-target
