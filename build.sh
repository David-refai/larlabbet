#!/bin/bash
# Builds the app into one self-contained HTML file with Vite (sources in app/):
#   dist/larlabbet.html  publish as the claude.ai artifact (without the 3D explorer)
#   index.html           the GitHub Pages site
#   build/test.html      what the browser tests open
# usage: bash build.sh            run from the repo root (npm install once first)
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
node tools/fix-imports.mjs
npx vite build --logLevel warn
mkdir -p dist build
cp dist/app/index.html index.html
# painted story pictures sit next to the page (GitHub Pages and the artifact's files)
rm -rf story && cp -r dist/app/story story
rm -rf body && cp -r dist/app/body body
cp dist/app/index.html build/test.html && rm -rf build/story && cp -r dist/app/story build/story && rm -rf build/body && cp -r dist/app/body build/body
# the claude.ai artifact build leaves the 3D explorer out: the artifact check rejects pages with it
VITE_WITH3D=0 npx vite build --logLevel warn
cp dist/app/index.html dist/larlabbet.html
echo BUILD OK
