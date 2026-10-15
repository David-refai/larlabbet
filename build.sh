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
cp dist/app/index.html build/test.html
# the claude.ai artifact build leaves the 3D explorer out: the artifact check rejects pages with it
VITE_WITH3D=0 npx vite build --logLevel warn
cp dist/app/index.html dist/larlabbet.html
echo BUILD OK
