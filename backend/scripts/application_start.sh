#!/bin/bash
export NVM_DIR="/home/ubuntu/.nvm"
export /home/ubuntu/.aws
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
source /home/ubuntu/.bashrc
cd /home/ubuntu/MyExpressApp/src
chmod +x ./scripts/*
node app.js > /dev/null 2>&1 &
