#!/bin/bash
cd ./frontend || { echo "Directory not found"; exit 1; }

MODULE_DIR="./node_modules"
BUILD_DIR="./dist"

if [ ! -d "$MODULE_DIR" ]; then
  npm i
fi

if [ ! -d "$BUILD_DIR" ]; then
  npm run build
fi

if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi