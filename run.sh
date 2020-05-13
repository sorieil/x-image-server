#!/bin/bash
set -e
TEMP_DIR="server-conference-api-new"
DIR="server-conference-api"
if [ -d "$TEMP_DIR" ]; then
    rm -rf $TEMP_DIR
    echo "Delete " + $TEMP_DIR
fi
eval `ssh-agent -s`
ssh-add ~/.ssh/bitbucket_rsa
git clone git@bitbucket.org:xsync_development/server-conference-api.git $TEMP_DIR
echo "Clone success"
cd $TEMP_DIR
git checkout -t origin/test
echo "Success git pull"
npm i
printf "Success node_moduels"
tsc
echo "Success Build"
cd ~
rm -rf $DIR
mv $TEMP_DIR $DIR
cd $DIR
pm2 start ecosystem.config.js --env=production
echo "Success Start"
echo "Successfully deploy"
