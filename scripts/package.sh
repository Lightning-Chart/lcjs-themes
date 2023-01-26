#!/bin/bash -e

# Clean package folder
rm -r ./package

# Create prod build
npm run build

# Copy build to package dir
mkdir -p ./package/dist
cp \
 ./dist/lcjs-themes.js \
 ./dist/lcjs-themes.iife.js \
 ./dist/lcjs-themes.mjs \
 ./dist/lcjs-themes.cjs \
 ./dist/lcjs-themes.esm.js \
 ./dist/lcjs-themes.iife.es2019.js \
 ./package/dist

# Copy typings file to package dir
sed '/^$/d' ./temp/lcjs-themes/es5/index.d.ts > ./package/dist/lcjs-themes.d.ts

# Copy meta files to package dir
cp -r ./publish/* ./package

# Copy changelog to package dir
cp ./CHANGELOG.md ./package

# Copy package.json to package dir
cp ./package.json ./package
