#!/bin/bash

EXTERNAL_DIR=""$(dirname "$PWD")""

# See also https://stackoverflow.com/questions/41495658/use-custom-build-output-folder-when-using-create-react-app
cd build &&

if [ ! -d "${EXTERNAL_DIR}/backend/public/demo" ]
  then
    echo "${EXTERNAL_DIR}/backend/public/demo Should be created"
    mkdir "${EXTERNAL_DIR}/backend/public/demo"
fi

echo '1/3 Clear "backend/public/demo/*" directory...'
rm -rf ${EXTERNAL_DIR}/backend/public/demo/*

echo '2/3 Move fersh build...'
mv -v ${EXTERNAL_DIR}/frontend.demo/build/* "${EXTERNAL_DIR}/backend/public/demo/"

echo '3/3 Remove frontend.demo/build directory.'
rm -rf ./build
