// Fysik Year 7, "Kraft och rörelse": 8 lessons and 4 harder "Lär mer" lessons, and the chapter test made from them.
// Lessons in order with 7-9 scenes and short explanations, sane question banks on every level (choice, written, with pictures),
// words to know, the chapter on the Fysik tab, nothing drawn outside the board and no labels on top of each other,
// a swinging pendulum (still under reduced motion), one lesson to the end with practice, and the test in Prov.
// Screenshots of every scene and of the question pictures go to build/fys7k/.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/fys7k';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const ONLY=process.env.ONLY?process.env.ONLY.split(','):null;
const BASE=['f7k1','f7k2','f7k3','f7k4','f7k5','f7k6','f7k7','f7k8'],MORE=['f7k9','f7k10','f7k11','f7k12'],IDS=[...BASE,...MORE];
/* everything drawn on the board, in board units: inside 0..800 x 0..500, and no two labels on top of each other */
const layout=()=>{const svg=document.querySelector('#stage svg.wb'),M=svg.getScreenCTM().inverse(),pt=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(M)};
  const box=e=>{const r=e.getBoundingClientRect(),a=pt(r.left,r.top),b=pt(r.right,r.bottom);return{x0:a.x,y0:a.y,x1:b.x,y1:b.y}};
  const kids=[...document.querySelectorAll('#ink > *')].filter(e=>!['clipPath','defs'].includes(e.tagName)),out=[];
  kids.forEach(e=>{const b=box(e);if(b.x1-b.x0<1&&b.y1-b.y0<1)return;if(b.x0<-3||b.y0<-3||b.x1>803||b.y1>503)out.push('outside: '+(e.textContent||e.tagName).slice(0,24)+' '+[b.x0,b.y0,b.x1,b.y1].map(Math.round))});
  const T=kids.filter(e=>e.tagName==='text').map(e=>[e.textContent,box(e)]);
  for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const [s,a]=T[i],[u,b]=T[j],ox=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),oy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);
    if(ox>3&&oy>6)out.push(`overlap: "${s}" / "${u}"`)}
  return out};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);

 /* the lessons exist, in order, with 7-9 scenes and explanations of at most 330 characters in Swedish */
 const meta=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id);return l?{id,ord:l.ord,n:l.steps.length,year:l.year,kind:l.kind,
   long:l.steps.filter(s=>!s.say.sv||!s.say.en||!s.say.ar||s.say.sv.length>330).length,max:Math.max(...l.steps.map(s=>s.say.sv.length))}:{id}}),IDS);
 ok(meta.every((m,k)=>m.n>=7&&m.n<=9&&m.year===7&&m.kind==='wb'&&m.ord===21+k&&m.long===0),tag+' 12 lessons, ord 21-32, 7-9 scenes, explanations ≤ 330 chars in three languages '+JSON.stringify(meta.map(m=>m.id+':'+m.n+'/'+m.max)));
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<60;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4||g.opts[g.ans]!==g.show))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},ONLY||IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const kinds=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id),s=new Set(),pic=new Set(),txt=new Set(),lv=new Set(),all=new Set();
   for(let k=0;k<600;k++){const g=l.gen(k%3);s.add(g.kind);all.add(g.qs);if(g.q.length>5)pic.add(g.qs);if(g.kind==='text')txt.add(g.qs)}
   return[id,[...s].sort().join('+'),pic.size,txt.size,all.size]}),ONLY||IDS);
 kinds.forEach(([id,k,n,t,a])=>ok(k==='choice+text'&&n>=2&&t>=2&&a>=16,`${tag} ${id} asks ${a} questions: choice and ${t} written, ${n} with a picture`));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),ONLY||IDS);
 words.forEach(([id,n])=>ok(n>=4,`${tag} ${id} has ${n} words to know`));

 /* the chapter on the Fysik tab: 8 lessons, then 4 in "Lär mer" */
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(300);
 const base=await p.$$eval('.chap[data-c="fys7-kraft"] > .cards .card',e=>e.map(x=>x.dataset.l));
 const more=await p.$$eval('.chap[data-c="fys7-kraft"] .cmore .card',e=>e.map(x=>x.dataset.l));
 ok(base.join()===BASE.join(),tag+' Fysik: the chapter holds the 8 lessons in order: '+base.join(','));
 ok(more.join()===MORE.join(),tag+' and 4 Lär mer lessons: '+more.join(','));
 ok(!(await p.$('.chap[data-c="fys7-kraft"] .csoon')),tag+' the chapter is no longer "coming soon"');
 await p.screenshot({path:`${D}/${tag}-map.png`,fullPage:true});

 /* every scene: nothing outside the board, no labels on top of each other; screenshots on the laptop (and a few on the phone) */
 const lay=[];
 for(const id of (ONLY||IDS)){await p.evaluate(()=>map());await p.waitForTimeout(100);await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(300);
  const n=await p.evaluate(id=>LESSONS.find(l=>l.id===id).steps.length,id);
  for(let k=0;k<n;k++){await p.evaluate(([id,k])=>{active.wb.cancel();active.wb.clear();return active.wb.run(LESSONS.find(l=>l.id===id).steps[k].draw(),true)},[id,k]);await p.waitForTimeout(60);
   (await p.evaluate(layout)).forEach(s=>lay.push(`${id} scene ${k+1}: ${s}`));
   if(tag==='laptop'||k%4===1)await (await p.$('#stage')).screenshot({path:`${D}/${tag}-${id}-s${k+1}.png`})}
  /* the question pictures */
  const qs=await p.evaluate(id=>{const l=LESSONS.find(x=>x.id===id),seen={};for(let k=0;k<400;k++){const g=l.gen(k%3);if(g.q.length>5&&!seen[g.qs])seen[g.qs]=1}return Object.keys(seen)},id);
  for(let j=0;j<qs.length;j++){await p.evaluate(([id,qs])=>{const l=LESSONS.find(x=>x.id===id);let g;for(let k=0;k<2000;k++){g=l.gen(k%3);if(g.qs===qs)break}
    active.wb.cancel();active.wb.clear();return active.wb.run([...g.q,...g.sol],true)},[id,qs[j]]);await p.waitForTimeout(60);
   (await p.evaluate(layout)).forEach(s=>lay.push(`${id} question "${qs[j].slice(0,30)}": ${s}`));
   if(tag==='laptop')await (await p.$('#stage')).screenshot({path:`${D}/${tag}-${id}-q${j+1}.png`})}}
 ok(!lay.length,tag+' every scene and question picture stays on the board without overlapping labels'+(lay.length?'\n   '+lay.join('\n   '):''));
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* moving drawings: the pendulums swing (still under reduced motion), the car drives */
 await p.click('.card[data-l="f7k3"]');await p.waitForTimeout(400);
 await p.evaluate(()=>{active.wb.fast=true;return active.step(4)});await p.waitForTimeout(600);
 const mv=await p.evaluate(()=>({t:document.querySelectorAll('#ink animateTransform').length,g:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.t===0&&mv.g>=3,tag+' reduced motion: the pendulums hang still '+JSON.stringify(mv));
 else{ok(mv.t>=3,tag+' three pendulums swing '+JSON.stringify(mv));
  const pos=async()=>p.evaluate(()=>[...document.querySelectorAll('#ink circle')].slice(-1).map(c=>{const r=c.getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y)}).join(' '));
  const a=await pos();await p.waitForTimeout(500);const bb=await pos();ok(a!==bb,tag+' the pendulum moves: '+a+' → '+bb)}
 await p.screenshot({path:`${D}/${tag}-f7k3-swing.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* one lesson to the end: every scene, then practice */
 await p.click('.card[data-l="f7k7"]');await p.waitForTimeout(400);
 const ns=await p.evaluate(()=>LESSONS.find(l=>l.id==='f7k7').steps.length);
 for(let k=0;k<ns;k++){await p.click('#say');await p.evaluate(()=>{if(active&&active.wb)active.wb.fast=true});await p.waitForSelector('#next:not([disabled])',{timeout:15000});await p.waitForTimeout(80);if(k===3)await p.screenshot({path:`${D}/${tag}-f7k7-play.png`});await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<14&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','talja');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n2=await p.$('#next');if(n2&&await n2.isEnabled())await n2.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} f7k7 practice asked ${q} questions`);
 await p.screenshot({path:`${D}/${tag}-f7k7-end.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* the chapter test in Prov: locked at the start, opens when unlocked */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.includes('prov-fys7-kraft:L'),tag+' the chapter test is listed and locked: '+ex.filter(x=>/fys/.test(x)).join(','));
 await p.evaluate(()=>{S.unlock={'prov-fys7-kraft':1};map()});await p.waitForTimeout(200);
 ok(!(await p.$eval('.excard[data-e="prov-fys7-kraft"]',e=>e.classList.contains('locked'))),tag+' unlocked test is open');
 await p.click('.excard[data-e="prov-fys7-kraft"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===20,tag+' the test has '+n+' questions');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);await p.click('#nx');await p.waitForTimeout(80)}
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 const st=await p.evaluate(()=>S.exams['prov-fys7-kraft']);ok(st&&st.tries===1&&st.n===20,tag+' result saved '+JSON.stringify(st));
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
