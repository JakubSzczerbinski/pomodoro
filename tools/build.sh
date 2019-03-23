#!/bin/bash

docker run -t \
  -v /home/szczerbi/Dokumenty/code/pomodoro/:/app \
  node:10 \
  /bin/bash -c "cd /app && yarn install && yarn build" \

