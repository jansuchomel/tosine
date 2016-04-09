#!/bin/sh
npm install
cp node_modules/bootstrap/dist/css/* dist/styles
cp node_modules/react-virtualized/styles.css dist/styles/virtualized.css
cp -R node_modules/bootstrap/dist/fonts dist
