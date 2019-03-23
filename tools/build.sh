#!/bin/bash

docker run -t \
  --volumes-from=jenkins \
  node:10 \
  /bin/bash -c "cd $(pwd) && yarn install && yarn build" \

