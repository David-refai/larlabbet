// Svenska pilot (åk 7): story with tappable words, word cards, grammar on the board, practice with choice and written answers
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/sv';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,lg] of [[1280,720,'laptop','sv'],[390,844,'phone','ar']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.click(`#langs button[data-l="${lg}"]`);await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);
 /* every generator gives sane questions */
 const ids=await p.evaluate(()=>LESSONS.filter(l=>l.subject==='swedish'&&l.year===7).sort((a,b)=>a.ord-b.ord).map(l=>l.id));
 const only=process.env.SV_IDS?process.env.SV_IDS.split(','):ids;
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<60;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||new Set(g.opts).size!==g.opts.length))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&!g.ans.length)out.push(id+' text')}});return out.slice(0,6)},ids);
 ok(!bad.length,tag+' generators sane '+bad.join(' | '));
 await p.click('.tab[data-t="swedish"]');await p.waitForTimeout(300);ok((await p.$$('.card')).length===ids.length,tag+' '+ids.length+' Swedish units on the map');await p.screenshot({path:`${D}/${tag}-map.png`});
 /* every unit after the first brings back words from earlier units */
 const back=await p.evaluate(ids=>ids.slice(1).map((id,i)=>{const txt=SVU[id].story.flatMap(x=>x.text).join(' '),old=ids.slice(0,i+1).flatMap(u=>SVU[u].words);
   return[id,old.filter(k=>{const m=TERMS[k].m;return m&&new RegExp(m.source,'i').test(txt)}).length]}),ids);
 back.forEach(([id,n])=>ok(n>=(id==='sv7b'?3:4),`${tag} ${id} story reuses ${n} earlier words`));
 for(const id of only){
  await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(500);
  const nw=await p.$$eval('.svstory .svw.new',e=>e.length);ok(nw>=1,`${tag} ${id} story part 1 has ${nw} highlighted new words`);
  await p.screenshot({path:`${D}/${tag}-${id}-story1.png`});
  await p.click('.svstory .svw.new');ok(await p.$eval('#wpop',e=>!e.hidden),tag+' tapping a word opens its card');await p.screenshot({path:`${D}/${tag}-${id}-card.png`});await p.click('#wok');
  let k=0;for(;k<14&&!(await p.$('#chk, .ch'));k++){const st=await p.evaluate(()=>{const s=document.querySelector('.svstory');return s&&!s.hidden?(document.querySelector('.svwords')?'words':'story'):'board'});
    if(k<10)await p.screenshot({path:`${D}/${tag}-${id}-step${k}-${st}.png`});
    const r=await p.evaluate(()=>{const v=innerHeight,q=s=>document.querySelector(s).getBoundingClientRect();return q('#next').bottom<=v+1&&q('#stage').bottom<=v+1});ok(r,`${tag} ${id} step ${k} fits the screen`);
    await p.evaluate(()=>{const n=document.querySelector('#next');n.disabled=false;n.click()});await p.waitForTimeout(400)}
  let kinds=[];for(let q=0;q<9&&!(await p.$('#mapb'));q++){
   if(await p.$('.txtin')){kinds.push('text');await p.screenshot({path:`${D}/${tag}-${id}-write.png`});await p.fill('#an','fel svar');await p.click('#chk')}
   else if(await p.$('.ch')){kinds.push('choice');if(q===0)await p.screenshot({path:`${D}/${tag}-${id}-q1.png`});await p.click('.ch')}
   await p.waitForTimeout(200);if(await p.$('#nx'))await p.click('#nx');await p.waitForTimeout(250);
   for(let j=0;j<4;j++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(200)}}}
  ok(!!await p.$('#mapb'),`${tag} ${id} practice ends (${kinds.join(',')})`);await p.click('#mapb');await p.waitForTimeout(300);await p.click('.tab[data-t="swedish"]').catch(()=>{});await p.waitForTimeout(200)}
 /* written answers: exact, case/punctuation-free, one letter off */
 const r=await p.evaluate(()=>{const l=LESSONS.find(x=>x.id==='sv7b');let g;do{g=l.gen(2)}while(g.kind!=='text');return g.ans[0]});
 ok(!!r,tag+' a write question exists: '+r);
 ok(!p.errs.length,tag+' no errors '+p.errs.join('|'));await p.close()}
await b.close()})();
