// Fysik Year 7, chapter "Materia": 5 base lessons + 3 "Lär mer", and the chapter test made from them.
// Banks, words, scenes (count, length, layout: nothing off the board, no labels on top of each other),
// the chapter on the Fysik tab, one lesson to the end with practice, moving particles, and the test in Prov.
// Screenshots of every scene and of the picture questions go to build/fys7m/.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/fys7m';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const BASE=['f7m1','f7m2','f7m3','f7m4','f7m5'],MORE=['f7m6','f7m7','f7m8'],IDS=[...BASE,...MORE];
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);

 /* the lessons: Year 7, ord 1-8, 7-9 scenes, explanations ≤ 330 characters and translated */
 const meta=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id);return l?{id,ord:l.ord,n:l.steps.length,year:l.year,
   long:l.steps.filter(s=>s.say.sv.length>330).length,tr:l.steps.every(s=>s.say.en&&s.say.ar)}:{id}}),IDS);
 ok(meta.every((m,k)=>m.n>=7&&m.n<=9&&m.year===7&&m.ord===k+1&&m.long===0&&m.tr),tag+' 8 lessons, 7-9 scenes, ord 1-8, explanations ≤ 330 chars '+JSON.stringify(meta.map(m=>m.id+':'+m.n+'/'+m.ord+'/'+m.long)));
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<60;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4||g.opts[g.ans]!==g.show))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const kinds=await p.evaluate(ids=>ids.map(id=>{const l=LESSONS.find(x=>x.id===id),s=new Set(),pic=new Set(),all=new Set();for(let k=0;k<600;k++){const g=l.gen(k%3);s.add(g.kind);all.add(g.qs+g.show);if(g.q.length>5)pic.add(g.qs+g.show)}return[id,[...s].sort().join('+'),pic.size,all.size]}),IDS);
 kinds.forEach(([id,k,n,a])=>ok(k==='choice+text'&&n>=2&&a>=16,`${tag} ${id}: choice and written questions, ${a} different, ${n} with a picture`));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),IDS);
 words.forEach(([id,n])=>ok(n>=5,`${tag} ${id} has ${n} words to know`));

 /* the chapter on the Fysik tab: 5 base cards, 3 Lär mer cards */
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(300);
 const cards=await p.$$eval('.chap[data-c="fys7-materia"] > .cards .card',e=>e.map(x=>x.dataset.l));
 const more=await p.$$eval('.chap[data-c="fys7-materia"] .cmore .card',e=>e.map(x=>x.dataset.l));
 ok(cards.join()===BASE.join(),tag+' Fysik: Materia holds the 5 base lessons in order: '+cards.join(','));
 ok(more.join()===MORE.join(),tag+' Fysik: Materia has 3 Lär mer lessons: '+more.join(','));
 ok(!(await p.$('.chap[data-c="fys7-materia"] .csoon')),tag+' the chapter is no longer "coming soon"');
 await p.screenshot({path:`${D}/${tag}-map.png`,fullPage:true});

 /* layout: every scene drawn, labels inside the board and not on top of each other (laptop only; the board is the same everywhere) */
 if(tag==='laptop'){const issues=[];
  for(const id of IDS){await p.evaluate(()=>map());await p.waitForTimeout(150);await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(400);
   const n=await p.evaluate(id=>LESSONS.find(l=>l.id===id).steps.length,id);
   for(let k=0;k<n;k++){
    const r=await p.evaluate(async k=>{const pr=active.step(k);setTimeout(()=>{active.wb.fast=true},30);await pr;await new Promise(r=>setTimeout(r,60));
      const T=[...document.querySelectorAll('#ink text')].map(e=>{const b=e.getBBox();return{s:e.textContent,x:b.x,y:b.y+b.height*.18,w:b.width,h:b.height*.62}});
      const P=[...document.querySelectorAll('#ink > path')].map(e=>{try{const b=e.getBBox();return[b.x,b.y,b.x+b.width,b.y+b.height]}catch(x){return null}}).filter(Boolean);
      const out=[];T.forEach(t=>{if(t.x<0||t.x+t.w>800||t.y<0||t.y+t.h>500)out.push('off board: '+t.s)});
      P.forEach(q=>{if(q[0]<-2||q[2]>802||q[1]<-2||q[3]>502)out.push('drawing off board '+q.map(Math.round).join(','))});
      for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const a=T[i],c=T[j],ox=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),oy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
        if(ox>4&&oy>4&&a.s.trim()&&c.s.trim())out.push(`overlap "${a.s}" / "${c.s}"`)}
      return out},k);
    r.forEach(x=>issues.push(`${id} scene ${k+1}: ${x}`));
    await (await p.$('.wbframe')).screenshot({path:`${D}/${id}-s${k+1}.png`})}}
  ok(!issues.length,tag+' every scene fits the board, no labels on top of each other'+(issues.length?'\n   '+issues.slice(0,60).join('\n   '):''));
  /* the picture questions, drawn on a board of their own */
  await p.evaluate(()=>map());await p.waitForTimeout(150);await p.click('.card[data-l="f7m1"]');await p.waitForTimeout(300);
  for(const id of IDS){const shots=await p.evaluate(async id=>{const l=LESSONS.find(x=>x.id===id),seen=new Set(),qs=[];for(let k=0;k<600;k++){const g=l.gen(k%3);if(g.q.length>5&&!seen.has(g.qs+g.show)){seen.add(g.qs+g.show);qs.push(g)}}
    window.__pq=qs;return qs.length},id);
   for(let i=0;i<shots;i++){await p.evaluate(async i=>{active.wb.cancel();active.wb.clear();await active.wb.run(window.__pq[i].q,true)},i);await (await p.$('.wbframe')).screenshot({path:`${D}/${id}-q${i+1}.png`})}}
 }

 /* moving particles: the gas box keeps flying (or stands still with reduced motion) */
 await p.evaluate(()=>map());await p.waitForTimeout(200);
 await p.click('.card[data-l="f7m2"]');await p.waitForTimeout(400);
 await p.evaluate(()=>{active.wb.fast=true;return active.step(6)});await p.waitForTimeout(500);
 const mv=await p.evaluate(()=>({m:document.querySelectorAll('#ink animateMotion').length,c:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.m===0&&mv.c>=40,tag+' reduced motion: particles stand still '+JSON.stringify(mv));
 else ok(mv.m>=40,tag+' solid, liquid and gas particles move '+JSON.stringify(mv));
 await p.screenshot({path:`${D}/${tag}-f7m2-states.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* one lesson to the end: every scene, then practice */
 await p.click('.card[data-l="f7m3"]');await p.waitForTimeout(400);
 const n3=await p.evaluate(()=>LESSONS.find(l=>l.id==='f7m3').steps.length);
 for(let k=0;k<n3;k++){await p.click('#say');await p.evaluate(()=>{if(active&&active.wb)active.wb.fast=true});await p.waitForSelector('#next:not([disabled])',{timeout:15000});await p.waitForTimeout(80);if(k===4)await p.screenshot({path:`${D}/${tag}-f7m3-s5.png`});await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<14&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','densitet');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n2=await p.$('#next');if(n2&&await n2.isEnabled())await n2.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} f7m3 practice asked ${q} questions`);
 await p.screenshot({path:`${D}/${tag}-f7m3-end.png`});
 await p.evaluate(()=>map());await p.waitForTimeout(200);

 /* the chapter test in Prov */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.includes('prov-fys7-materia:L'),tag+' the Materia chapter test is listed and locked: '+ex.filter(x=>/fys/.test(x)).join(','));
 await p.evaluate(()=>{S.unlock={'prov-fys7-materia':1};map()});await p.waitForTimeout(200);
 await p.click('.excard[data-e="prov-fys7-materia"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===20,tag+' the test has '+n+' questions');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);await p.click('#nx');await p.waitForTimeout(80)}
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 const st=await p.evaluate(()=>S.exams['prov-fys7-materia']);ok(st&&st.tries===1&&st.n===20,tag+' result saved '+JSON.stringify(st));
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
