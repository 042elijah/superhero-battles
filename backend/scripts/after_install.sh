#!/bin/bash
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
source /home/ubuntu/.bashrc
cd /home/ubuntu/MyExpressApp
chmod +x ./scripts/*
npm install
