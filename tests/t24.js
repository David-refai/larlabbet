// NO Year 4, the human body: 7 lessons and the chapter test (prov). Generators, the map, one lesson to the end, the test with its results page, and the parents page.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/no';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const IDS=['no4a','no4b','no4c','no4d','no4e','no4f','no4g'];
(async()=>{const b=await chromium.launch();
for(const [w,h,tag] of [[1280,720,'laptop'],[390,844,'phone']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
 /* every question bank gives sane questions on every level */
 const bad=await p.evaluate(ids=>{const out=[];ids.forEach(id=>{const l=LESSONS.find(x=>x.id===id);for(let lv=0;lv<3;lv++)for(let k=0;k<40;k++){const g=l.gen(lv);
   if(!g||!g.q||!g.show||!g.qs)out.push(id+lv+' empty');else if(g.kind==='choice'&&(g.ans<0||g.opts.length!==4||new Set(g.opts).size!==4))out.push(id+lv+' opts '+g.opts.join('/'));
   else if(g.kind==='text'&&![].concat(g.ans).length)out.push(id+' text')}});return out.slice(0,6)},IDS);
 ok(!bad.length,tag+' question banks sane '+bad.join(' | '));
 const words=await p.evaluate(ids=>ids.map(id=>[id,lessonWords(LESSONS.find(l=>l.id===id)).length]),IDS);
 words.forEach(([id,n])=>ok(n>=5,`${tag} ${id} has ${n} words to know`));
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(300);
 const cards=await p.$$eval('.chap[data-c="bio4-kropp"] .card',e=>e.map(x=>x.dataset.l));ok(IDS.every((id,k)=>cards[k]===id),tag+' Biologi: the body chapter holds the 7 lessons in order: '+cards.join(','));
 await p.screenshot({path:`${D}/${tag}-map.png`});
 /* one lesson to the end: every scene, then practice */
 await p.click('.card[data-l="no4c"]');await p.waitForTimeout(400);
 for(let k=0;k<8;k++){await p.click('#say');await p.waitForTimeout(80);if(k===3)await p.screenshot({path:`${D}/${tag}-no4c-s3.png`});await p.click('#next');await p.waitForTimeout(150)}
 let q=0;for(let k=0;k<12&&!(await p.$('#mapb'));k++){
  const ch=await p.$('.ch');if(ch){await ch.click();q++}else if(await p.$('#an')){await p.fill('#an','blod');await p.click('#chk');q++}
  await p.waitForTimeout(150);const nx=await p.$('#nx');if(nx){await nx.click();await p.waitForTimeout(150)}else{const n2=await p.$('#next');if(n2&&await n2.isEnabled())await n2.click();await p.waitForTimeout(150)}}
 ok(q>=3,`${tag} no4c practice asked ${q} questions`);
 await p.evaluate(()=>map());await p.waitForTimeout(200);
 /* the test: no hints, no right/wrong while answering, then the results page */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 await p.evaluate(()=>{S.unlock={prov4kropp:1};map()});await p.waitForTimeout(200);
 await p.click('.excard[data-e="prov4kropp"]');await p.waitForTimeout(400);
 const n=await p.$$eval('#prog i',e=>e.length);ok(n===21,tag+' the test has '+n+' questions');
 ok(await p.$eval('#help',e=>e.hidden),tag+' no help button in the test');
 await p.screenshot({path:`${D}/${tag}-exam-q1.png`});
 let leaked=false;
 for(let k=0;k<n;k++){const ch=await p.$('.ch');if(ch)await ch.click();else{await p.fill('#an','vet ej');await p.click('#chk')}await p.waitForTimeout(80);
  const t=await p.textContent('#ctrl');if(/✓|✗/.test(t))leaked=true;await p.click('#nx');await p.waitForTimeout(80)}
 ok(!leaked,tag+' no right/wrong shown during the test');
 await p.waitForTimeout(300);ok(!!(await p.$('.exres')),tag+' results page');
 const rows=await p.$$eval('.exlist li',e=>e.length);ok(rows===n,tag+' review lists all '+rows+' questions');
 const pct=await p.textContent('.exring b');console.log(tag,'score',pct);await p.screenshot({path:`${D}/${tag}-exam-result.png`,fullPage:true});
 const st=await p.evaluate(()=>S.exams.prov4kropp);ok(st&&st.tries===1&&st.n===21,tag+' result saved '+JSON.stringify(st));
 await p.click('#exagain');await p.waitForTimeout(300);ok((await p.$$eval('#prog i',e=>e.length))===21,tag+' test can be taken again');
 await p.evaluate(()=>map());await p.waitForTimeout(200);
 await p.evaluate(()=>parents());await p.waitForTimeout(300);ok(!!(await p.$('#pexams')),tag+' parents page lists the test');
 await p.screenshot({path:`${D}/${tag}-parents.png`,fullPage:true});
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
