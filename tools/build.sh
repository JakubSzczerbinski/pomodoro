#!/bin/bash

docker run -t \
  --volumes-from=jenkins \
  -v $(pwd):/app \
  node:10 \
  /bin/bash -c "cd /app && yarn install && yarn build" \

