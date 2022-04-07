set -x
ps aux | grep "bin/node" | grep start.js | kill -9 $(awk '{print $2}')
export NODE_OPTIONS=--openssl-legacy-provider && yarn start