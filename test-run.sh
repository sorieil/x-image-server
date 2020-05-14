#!/bin/bash
set -e
TEMP_DIR="server-image-api-new"
DIR="server-image-api"
if [ -d "$TEMP_DIR" ]; then
    rm -rf $TEMP_DIR
    echo "Delete " + $TEMP_DIR
fi
eval `ssh-agent -s`
ssh-add ~/.ssh/bitbucket_rsa
git clone git@bitbucket.org:xsync_development/server-image-api.git $TEMP_DIR
echo "Clone success"
cd $TEMP_DIR
# git checkout -t origin/master
echo "Success git pull"
yarn --production=false
echo "Success node_moduels"
#npx tsc You have to complie at this point, but I'm temporarily compiling locally for server performonce issues.
echo "Success Build"
cd ~
rm -rf $DIR
mv $TEMP_DIR $DIR
cd $DIR
pm2 start ecosystem.config.js --env production
echo "Success Start"
echo "Successfully deploy"