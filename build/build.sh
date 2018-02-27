#!/bin/sh
rm -rf dist/
yarn --pure-lockfile --silent
docker run --rm -it                 \
    -v "${PWD}:/home/node/app"      \
    -w /home/node/app               \
    --user 501                      \
    node:8                          \
    yarn run build

mkdir -p ./dist/dist
mv dist/build* ./dist/dist
cp index.html ./dist/

docker build -t local-waves-transactions -f ./build/Dockerfile.prod .

echo "Done"
echo "to test:   'docker run --rm -it -p 8000:80 local-waves-transactions'"
echo "to deploy: 'docker rm -f waves-transactions; docker run -d --name waves-transactions -p 80:80 local-waves-transactions'"
