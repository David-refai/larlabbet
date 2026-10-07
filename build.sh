#!/bin/bash
# Builds the app into one self-contained HTML file with Vite (sources in app/):
#   dist/larlabbet.html  publish as the claude.ai artifact
#   index.html           the GitHub Pages site
#   build/test.html      what the browser tests open
# usage: bash build.sh            run from the repo root (npm install once first)
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
node tools/fix-imports.mjs
npx vite build --logLevel warn
mkdir -p dist build
cp dist/app/index.html dist/larlabbet.html
cp dist/app/index.html index.html
cp dist/app/index.html build/test.html
echo BUILD OK
