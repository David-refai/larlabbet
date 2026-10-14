// Biologi Year 4, "Djur, växter och ekosystem": 6 lessons and the chapter test made from them.
// Question banks, words, the chapter on the Biologi tab, one lesson to the end with practice, moving drawings, and the test in Prov.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/bio';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const IDS=['bio4h','bio4i','bio4j','bio4k','bio4l','bio4m'];
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);

 /* the lessons exist, in order, with 8 scenes (9 in bio4i, which zooms into a leaf) and short explanations */
 const meta=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id);return l?{id,ord:l.ord,n:l.steps.length,year:l.year,long:l.steps.filter(s=>s.say.sv.length>330).length}:{id}}),IDS);
 ok(meta.every((m,k)=>m.n===(m.id==="bio4i"?9:8)&&m.year===4&&m.ord===9+k&&m.long===0),tag+' 6 lessons, 8 scenes each (bio4i 9), ord 9-14, explanations ≤ 330 chars '+JSON.stringify(meta.map(m=>m.id+':'+m.n+'/'+m.ord)));
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<40;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4||g.opts[g.ans]!==g.show))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const kinds=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id),s=new Set(),pic=new Set();for(let k=0;k<300;k++){const g=l.gen(k%3);s.add(g.kind);if(g.q.length>4)pic.add(g.qs+g.show)}return[id,[...s].sort().join('+'),pic.size]}),IDS);
 kinds.forEach(([id,k,n])=>ok(k==='choice+text'&&n>=1,`${tag} ${id} asks choice and written questions, ${n} with a picture`));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),IDS);
 words.forEach(([id,n])=>ok(n>=5,`${tag} ${id} has ${n} words to know`));

 /* the chapter on the Biologi tab */
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(300);
 const cards=await p.$$eval('.chap[data-c="bio4-natur"] .card',e=>e.map(x=>x.dataset.l));
 ok(cards.length===6&&IDS.every((id,k)=>cards[k]===id),tag+' Biologi: the nature chapter holds the 6 lessons in order: '+cards.join(','));
 ok(!(await p.$('.chap[data-c="bio4-natur"] .csoon')),tag+' the chapter is no longer "coming soon"');
 await p.screenshot({path:`${D}/${tag}-map.png`,fullPage:true});

 /* moving drawings: the photosynthesis scene keeps flowing */
 await p.click('.card[data-l="bio4i"]');await p.waitForTimeout(400);
 await p.evaluate(()=>{active.wb.fast=true;return active.step(5)});await p.waitForTimeout(400);
 const mv=await p.evaluate(()=>({m:document.querySelectorAll('#ink animateMotion').length,c:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.m===0&&mv.c>=20,tag+' reduced motion: still dots '+JSON.stringify(mv));
 else ok(mv.m>=20,tag+' sunlight, water, carbon dioxide, oxygen and sugar flow '+JSON.stringify(mv));
 await p.screenshot({path:`${D}/${tag}-bio4i-s4.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* one lesson to the end: every scene, then practice */
 await p.click('.card[data-l="bio4j"]');await p.waitForTimeout(400);
 for(let k=0;k<8;k++){await p.click('#say');await p.evaluate(()=>{if(active&&active.wb)active.wb.fast=true});await p.waitForSelector('#next:not([disabled])',{timeout:15000});await p.waitForTimeout(80);if(k===6)await p.screenshot({path:`${D}/${tag}-bio4j-s6.png`});await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<12&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','producent');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n2=await p.$('#next');if(n2&&await n2.isEnabled())await n2.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} bio4j practice asked ${q} questions`);
 await p.screenshot({path:`${D}/${tag}-bio4j-end.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* the chapter test in Prov: locked at the start, opens when unlocked */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.includes('prov-bio4-natur:L'),tag+' the chapter test is listed and locked: '+ex.filter(x=>/bio|kropp/.test(x)).join(','));
 await p.click('.excard[data-e="prov-bio4-natur"]');await p.waitForTimeout(200);ok(!(await p.$('#prog')),tag+' a locked test does not open');
 await p.evaluate(()=>{S.unlock={'prov-bio4-natur':1};map()});await p.waitForTimeout(200);
 ok(!(await p.$eval('.excard[data-e="prov-bio4-natur"]',e=>e.classList.contains('locked'))),tag+' unlocked test is open');
 await p.click('.excard[data-e="prov-bio4-natur"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===20,tag+' the test has '+n+' questions');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 let leaked=false;
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);
  const t=await p.textContent('#ctrl');if(/✓|✗/.test(t))leaked=true;await p.click('#nx');await p.waitForTimeout(80)}
 ok(!leaked,tag+' no right/wrong shown during the test');
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 const st=await p.evaluate(()=>S.exams['prov-bio4-natur']);ok(st&&st.tries===1&&st.n===20,tag+' result saved '+JSON.stringify(st));
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
