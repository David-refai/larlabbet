#!/bin/bash
# Builds dist/larlabbet.html (the single-file app), index.html (the GitHub Pages site) and build/test.html (for the browser tests).
# usage: bash build.sh            run from the repo root
set -e
cd "$(dirname "$0")"
mkdir -p dist build
python3 - <<'P'
import re
s=open('src/app.src.html').read()
assert s.count('/*LAND*/null')==1
s=s.replace('/*LAND*/null',open('src/land.json').read().strip())
import glob
les=''.join(open(f).read()+'\n' for f in sorted(glob.glob('src/lessons/*.js')))
assert s.count('/*NEW-LESSONS*/')==1
s=s.replace('/*NEW-LESSONS*/',les+'/*NEW-LESSONS*/')
open('dist/larlabbet.html','w').write(s)
open('index.html','w').write('<!doctype html>\n<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n'+s+'\n</body></html>\n')  # GitHub Pages
open('build/test.html','w').write('<!doctype html>\n'+s)
open('build/a.js','w').write(re.findall(r'<script>(.*?)</script>',s,re.S)[0])
P
node --check build/a.js && echo BUILD OK
