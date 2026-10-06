#!/bin/bash
# Drops a new lesson file into a copy of the app (after src/lessons/*.js, at the /*NEW-LESSONS*/ marker) so it can be
# tried out before it is moved into src/lessons/.
# usage: bash tools/lesson-build.sh <lessons.js> <outdir>      run from the repo root
set -e
mkdir -p "$2"
python3 - "$1" "$2" <<'P'
import sys,re
s=open('src/app.src.html').read();f=open(sys.argv[1]).read()
assert s.count('/*NEW-LESSONS*/')==1
import glob
les=''.join(open(x).read()+'\n' for x in sorted(glob.glob('src/lessons/*.js')))
s=s.replace('/*NEW-LESSONS*/',les+f).replace('/*LAND*/null',open('src/land.json').read().strip())
open(sys.argv[2]+'/test.html','w').write('<!doctype html>\n'+s)
open(sys.argv[2]+'/a.js','w').write(re.findall(r'<script>(.*?)</script>',s,re.S)[0])
P
node --check "$2/a.js" && echo BUILD OK
