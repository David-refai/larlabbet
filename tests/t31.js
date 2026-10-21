// Fysik Year 7, "Värme och klimat": 5 base lessons, 3 "Lär mer" lessons and the chapter test made from them.
// Lessons and scenes, question banks, words, the chapter on the Fysik tab, the board layout of every scene,
// moving drawings, one lesson to the end with practice, and the test in Prov.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/fys7v';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const BASE=['f7v1','f7v2','f7v3','f7v4','f7v5'],MORE=['f7v6','f7v7','f7v8'],IDS=[...BASE,...MORE];
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);

 /* the lessons exist, in order, with 7-9 scenes and short explanations in three languages */
 const meta=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id);return l?{id,ord:l.ord,n:l.steps.length,year:l.year,
   long:l.steps.filter(s=>s.say.sv.length>330).length,tr:l.steps.every(s=>s.say.en&&s.say.ar)}:{id}}),IDS);
 ok(meta.every((m,k)=>m.n>=7&&m.n<=9&&m.year===7&&m.ord===11+k&&m.long===0&&m.tr),tag+' 8 lessons, 7-9 scenes, ord 11-18, explanations ≤ 330 chars '+JSON.stringify(meta.map(m=>m.id+':'+m.n+'/'+m.ord+'/'+m.long)));
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<40;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4||g.opts[g.ans]!==g.show))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const kinds=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id),s=new Set(),pic=new Set(),txt=new Set(),all=new Set();
   for(let k=0;k<600;k++){const g=l.gen(k%3);s.add(g.kind);all.add(g.qs);if(g.q.length>5)pic.add(g.qs+g.show);if(g.kind==='text')txt.add(g.qs)}return[id,[...s].sort().join('+'),pic.size,txt.size,all.size]}),IDS);
 kinds.forEach(([id,k,n,t,a])=>ok(k==='choice+text'&&n>=2&&t>=2&&a>=16,`${tag} ${id}: ${a} questions, ${t} written, ${n} with a picture`));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),IDS);
 words.forEach(([id,n])=>ok(n>=5,`${tag} ${id} has ${n} words to know`));

 /* the chapter on the Fysik tab: 5 lessons, then 3 "Lär mer" */
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(300);
 const cards=await p.$$eval('.chap[data-c="fys7-varme"] > .cards .card',e=>e.map(x=>x.dataset.l));
 const more=await p.$$eval('.chap[data-c="fys7-varme"] .cmore .card',e=>e.map(x=>x.dataset.l));
 ok(cards.join()===BASE.join(),tag+' Fysik åk 7: Värme och klimat holds the 5 lessons in order: '+cards.join(','));
 ok(more.join()===MORE.join(),tag+' and 3 Lär mer lessons: '+more.join(','));
 ok(!(await p.$('.chap[data-c="fys7-varme"] .csoon')),tag+' the chapter is not "coming soon"');
 await p.screenshot({path:`${D}/${tag}-map.png`,fullPage:true});

 /* every scene: text stays on the board and labels do not overlap (laptop); screenshots of several scenes */
 const lay=[];
 for(const id of IDS){await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(400);
  const n=meta.find(m=>m.id===id).n;
  for(let k=0;k<n;k++){
   const look=k=>p.evaluate(async k=>{const pr=active.step(k);const iv=setInterval(()=>{active.wb.fast=true},5);await pr;clearInterval(iv);
     if(document.querySelector('svg.wb').getAttribute('viewBox')!=='0 0 800 500')return[];
     const T=[...document.querySelectorAll('#ink text')].map(e=>{const b=e.getBBox();return{s:e.textContent,x:b.x,y:b.y,w:b.width,h:b.height}}),out=[];
     T.forEach(t=>{if(t.x<2||t.y<2||t.x+t.w>798||t.y+t.h>498)out.push('outside: '+t.s)});
     for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const a=T[i],c=T[j],ox=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),oy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
       if(ox>3&&oy>Math.min(a.h,c.h)*.25)out.push('overlap: '+a.s+' × '+c.s)}
     [...document.querySelectorAll('#ink path')].forEach(e=>{const b=e.getBBox();if(b.width<1000&&(b.x<-2||b.y<-2||b.x+b.width>802||b.y+b.height>502))out.push('line outside the board')});
     return out},k);
   /* replaying many scenes fast can race inside the engine; try a scene once more before failing */
   let r;try{r=await look(k)}catch(e){await p.waitForTimeout(400);r=await look(k);console.log(`  (${tag} ${id} scene ${k+1} drawn again: ${e.message.split('\n')[0]})`)}
   r.forEach(x=>lay.push(`${id} scene ${k+1}: ${x}`));
   if(tag==='laptop'||k%3===0){await p.waitForTimeout(120);await p.screenshot({path:`${D}/${tag}-${id}-s${k}.png`})}
  }
  await p.evaluate(()=>map());await p.waitForTimeout(200);
 }
 ok(!lay.length,tag+' every scene fits the board, no labels on top of each other '+lay.slice(0,8).join(' | '));

 /* moving drawings: water circulates in the pot */
 await p.click('.card[data-l="f7v3"]');await p.waitForTimeout(400);
 await p.evaluate(()=>{active.wb.fast=true;return active.step(4)});await p.waitForTimeout(500);
 const mv=await p.evaluate(()=>({m:document.querySelectorAll('#ink animateMotion').length,c:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.m===0&&mv.c>=16,tag+' reduced motion: still dots '+JSON.stringify(mv));
 else ok(mv.m>=16,tag+' convection loops move '+JSON.stringify(mv));
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* one lesson to the end: every scene, then practice */
 await p.click('.card[data-l="f7v1"]');await p.waitForTimeout(400);
 const n1=meta[0].n;
 for(let k=0;k<n1;k++){await p.click('#say');await p.evaluate(()=>{if(active&&active.wb)active.wb.fast=true});await p.waitForSelector('#next:not([disabled])',{timeout:15000});await p.waitForTimeout(80);
  if(k===n1-2)await p.screenshot({path:`${D}/${tag}-f7v1-play.png`});await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<12&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','termometer');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n2=await p.$('#next');if(n2&&await n2.isEnabled())await n2.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} f7v1 practice asked ${q} questions`);
 await p.screenshot({path:`${D}/${tag}-f7v1-end.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* the chapter test in Prov: listed and locked, opens when unlocked */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.includes('prov-fys7-varme:L'),tag+' the chapter test is listed and locked: '+ex.filter(x=>/fys/.test(x)).join(','));
 await p.evaluate(()=>{S.unlock={'prov-fys7-varme':1};map()});await p.waitForTimeout(200);
 await p.click('.excard[data-e="prov-fys7-varme"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===20,tag+' the test has '+n+' questions');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);await p.click('#nx');await p.waitForTimeout(80)}
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
