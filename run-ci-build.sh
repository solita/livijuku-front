#!/bin/bash

PROJECT=livijuku-front-build
read -r -d '' SCRIPT <<- End
    Xvfb :1 -ac &
    cd $PROJECT
    eval ./ci.sh
End

IMG=sirkkalap/jenkins-swarm-slave-nlm:java8
MOUNT="-v $(pwd):/home/jenkins-slave/$PROJECT"
ENVS="-e "USER=$USER""
NAME="--name $PROJECT"
OPTS="-it --sig-proxy=true"

VOLFROM=$(docker ps -a | grep $PROJECT-volume | cut -d ' ' -f1)
if [ ! -z $VOLFROM ]; then
    VOLFROM="--volumes-from $VOLFROM"
else
    echo "To make persistent volume for build (cache) use:"
    echo "docker run --name $PROJECT-volume $MOUNT -v /home/jenkins-slave $IMG true"
fi

docker rm -f $PROJECT 2>/dev/null
docker run $OPTS $NAME $VOLFROM $ENVS $MOUNT $IMG /bin/bash -c "$SCRIPT"
