// Fysik Year 7, chapter "Tryck": 6 base lessons, 2 "Lär mer" lessons and the chapter test made from them.
// Question banks, words, scene counts and explanation length, the chapter on the Fysik tab, one lesson to the end with practice,
// moving drawings, the test in Prov, and screenshots of the scenes and picture questions of every lesson (build/fys7t/).
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/fys7t';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
/* draw scene k at once: run() resets wb.fast, so keep setting it until the step is done (never wait more than 8 s) */
const fastStep=(p,k)=>p.evaluate(k=>{const pr=active.step(k),iv=setInterval(()=>{active.wb.fast=true},15);return Promise.race([pr,new Promise(r=>setTimeout(r,8000))]).then(()=>clearInterval(iv))},k);
const BASE=['f7t1','f7t2','f7t3','f7t4','f7t5','f7t6'],MORE=['f7t7','f7t8'],IDS=[...BASE,...MORE];
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);

 /* the lessons exist, in order, with 7-9 scenes and short explanations in all three languages */
 const meta=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id);return l?{id,ord:l.ord,n:l.steps.length,year:l.year,subject:l.subject,
   long:l.steps.filter(s=>s.say.sv.length>330).length,tr:l.steps.every(s=>s.say.en&&s.say.ar&&typeof s.draw==='function')}:{id}}),IDS);
 ok(meta.every((m,k)=>m.n>=7&&m.n<=9&&m.year===7&&m.subject==='science'&&m.ord===41+k&&m.long===0&&m.tr),tag+' 8 lessons, 7-9 scenes each, ord 41-48, explanations ≤ 330 chars, sv/en/ar '+JSON.stringify(meta.map(m=>m.id+':'+m.n+'/'+m.ord+(m.long?'/LONG'+m.long:''))));
 /* every scene draws without throwing, starts with a wipe, and stays on the 800 × 500 board */
 const draws=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);l.steps.forEach((s,k)=>{try{const a=s.draw();if(!Array.isArray(a)||a[0].t!=='wipe')out.push(id+'/'+k+' no wipe');
     a.forEach(o=>{if(o.t==='text'&&(o.x<0||o.x>800||o.y<20||o.y>500))out.push(id+'/'+k+' text off board: '+o.s)})}catch(e){out.push(id+'/'+k+' '+e.message)}})});return out},IDS);
 ok(!draws.length,tag+' every scene draws on the board '+draws.slice(0,6).join(' | '));
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<60;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4||g.opts[g.ans]!==g.show))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const kinds=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id),s=new Set(),pic=new Set(),txt=new Set(),all=new Set();for(let k=0;k<900;k++){const g=l.gen(k%3);s.add(g.kind);all.add(g.qs+g.show);if(g.q.length>4)pic.add(g.qs+g.show);if(g.kind==='text')txt.add(g.qs)}return[id,[...s].sort().join('+'),pic.size,txt.size,all.size]}),IDS);
 kinds.forEach(([id,k,n,t,a])=>ok(k==='choice+text'&&n>=2&&t>=2&&a>=16,`${tag} ${id}: ${a} questions, choice and written (${t}), ${n} with a picture`));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),IDS);
 words.forEach(([id,n])=>ok(n>=5,`${tag} ${id} has ${n} words to know`));
 const wtr=await p.evaluate(()=>Object.keys(TERMS).filter(k=>k.startsWith('f7t_')).filter(k=>{const t=TERMS[k];return!(t.d&&t.d.sv&&t.d.en&&t.d.ar&&t.tr&&t.tr.en&&t.tr.ar&&t.ex)}));
 ok(!wtr.length,tag+' every word has sv/en/ar explanations, translations and an example '+wtr.join(','));

 /* the chapter on the Fysik tab: 6 lessons, and 2 under "Lär mer" */
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(300);
 const all=await p.$$eval('.chap[data-c="fys7-tryck"] .card',e=>e.map(x=>x.dataset.l));
 const more=await p.$$eval('.chap[data-c="fys7-tryck"] .cmore .card',e=>e.map(x=>x.dataset.l));
 const base=all.filter(id=>!more.includes(id));
 ok(base.length===6&&BASE.every((id,k)=>base[k]===id),tag+' Fysik: the Tryck chapter holds the 6 base lessons in order: '+base.join(','));
 ok(more.length===2&&MORE.every((id,k)=>more[k]===id),tag+' Lär mer holds f7t7 and f7t8: '+more.join(','));
 ok(!(await p.$('.chap[data-c="fys7-tryck"] > .csoon')),tag+' the chapter is not "coming soon"');
 await p.evaluate(()=>document.querySelector('.chap[data-c="fys7-tryck"]').scrollIntoView());await p.waitForTimeout(150);
 await p.screenshot({path:`${D}/${tag}-map.png`});

 /* moving drawings: the straw scene keeps flowing */
 await p.click('.card[data-l="f7t3"]');await p.waitForTimeout(400);
 await fastStep(p,4);await p.waitForTimeout(400);
 const mv=await p.evaluate(()=>({m:document.querySelectorAll('#ink animateMotion').length,c:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.m===0&&mv.c>=5,tag+' reduced motion: still dots '+JSON.stringify(mv));
 else ok(mv.m>=5,tag+' juice flows up the straw '+JSON.stringify(mv));
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* screenshots of every scene (laptop) or a few (phone), and of the picture questions */
 for(const id of IDS){await p.click('.tab[data-t="fys"]');await p.waitForTimeout(150);await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(300);
  const n=await p.evaluate(id=>LESSONS.find(x=>x.id===id).steps.length,id);
  for(let k=0;k<n;k++){if(tag==='phone'&&k%3)continue;await fastStep(p,k);await p.waitForTimeout(120);
   const el=await p.$('.wbframe');await (el||p).screenshot({path:`${D}/${tag}-${id}-s${k}.png`})}
  if(tag==='laptop'){const seen=new Set();for(let t=0,miss=0;t<300&&miss<80;t++){const key=await p.evaluate(([id,t])=>{const l=LESSONS.find(x=>x.id===id),g=l.gen(t%3);if(g.q.length<=4)return null;
     active.wb.cancel();active.wb.clear();active.wb.run([...g.q,...g.sol],true);return g.qs+'|'+g.show},[id,t]);
    if(!key||seen.has(key))miss++;else{miss=0;seen.add(key);await p.waitForTimeout(80);const el=await p.$('.wbframe');await (el||p).screenshot({path:`${D}/${tag}-${id}-q${seen.size}.png`})}}}
  await p.evaluate(()=>map());await p.waitForTimeout(150)}

 /* one lesson to the end: every scene, then practice */
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(150);
 await p.click('.card[data-l="f7t2"]');await p.waitForTimeout(400);
 const n2=await p.evaluate(()=>LESSONS.find(x=>x.id==='f7t2').steps.length);
 for(let k=0;k<n2;k++){await p.click('#say');await p.evaluate(()=>{if(active&&active.wb)active.wb.fast=true});await p.waitForSelector('#next:not([disabled])',{timeout:15000});await p.waitForTimeout(80);await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<14&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','area');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n3=await p.$('#next');if(n3&&await n3.isEnabled())await n3.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} f7t2 practice asked ${q} questions`);
 await p.screenshot({path:`${D}/${tag}-f7t2-end.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* the chapter test in Prov: locked at the start, opens when unlocked */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.includes('prov-fys7-tryck:L'),tag+' the chapter test is listed and locked: '+ex.filter(x=>/fys7/.test(x)).join(','));
 await p.evaluate(()=>{S.unlock={'prov-fys7-tryck':1};map()});await p.waitForTimeout(200);
 ok(!(await p.$eval('.excard[data-e="prov-fys7-tryck"]',e=>e.classList.contains('locked'))),tag+' unlocked test is open');
 await p.click('.excard[data-e="prov-fys7-tryck"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===20,tag+' the test has '+n+' questions');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);await p.click('#nx');await p.waitForTimeout(80)}
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 const st=await p.evaluate(()=>S.exams['prov-fys7-tryck']);ok(st&&st.tries===1&&st.n===20,tag+' result saved '+JSON.stringify(st));
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
