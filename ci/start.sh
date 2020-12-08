#!/bin/bash

set -e

cd /gitql/gitql-api/
npm install
npm install -g ts-node && ts-node src/generate-typings
npm run start
