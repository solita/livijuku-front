#!/bin/bash

PROJECT=livijuku-front-build
CONTAINER_HOME=/home/jenkins-slave

read -r -d '' SCRIPT <<- End
    command -v Xvfb >/dev/null 2>&1 || (sudo apt-get update && sudo apt-get -y install Xvfb)
    sudo Xvfb :1 -ac &
    export DISPLAY=:1
    rsync -aP --delete --exclude node_modules --exclude bower_components --exclude .git $CONTAINER_HOME/$PROJECT/ $CONTAINER_HOME/$PROJECT.local/
    cd $CONTAINER_HOME/$PROJECT.local
    command -v bower >/dev/null 2>&1 || sudo npm install -g bower
    command -v grunt >/dev/null 2>&1 || sudo npm install -g grunt-cli
    eval ./ci.sh
End

IMG=${1:-sirkkalap/jenkins-swarm-slave-nlm:java8}
MOUNT="-v $(pwd):$CONTAINER_HOME/$PROJECT"
ENVS="-e "USER=$USER" -e "HOME=$CONTAINER_HOME""
NAME="--name $PROJECT"
OPTS="-it -p 4444 -p 8082 -p 9000 --sig-proxy=true"

VOLFROM=$(docker ps -a | grep -o $PROJECT-volume)
if [ ! -z $VOLFROM ]; then
    VOLFROM="--volumes-from $VOLFROM"
else
    echo "To make persistent volume for build (cache) use:"
    echo "docker run --name $PROJECT-volume $MOUNT -v $CONTAINER_HOME $IMG true"
fi

docker rm -f $PROJECT 2>/dev/null
docker run $OPTS $NAME $VOLFROM $ENVS $MOUNT $IMG /bin/bash -c "$SCRIPT"

