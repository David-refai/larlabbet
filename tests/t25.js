// v30 structure: subjects (Biologi, Fysik, Kemi apart), chapters in Year 4, the Prov tab with locked tests,
// a parent unlocking one and making an own test, the wide lesson card, and moving drawings (blood flow, a beating heart).
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/v30';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);

 const tabs=await p.$$eval('.tab',e=>e.map(x=>x.dataset.t));ok(tabs.join()==='math,swedish,bio,fys,kemi,english',tag+' subject tabs '+tabs.join());
 const mch=await p.$$eval('.chap',e=>e.map(x=>x.querySelectorAll('.card').length));ok(mch.length===6&&mch.reduce((a,c)=>a+c,0)===15,tag+' Matte Åk 4: 6 chapters, 15 lessons '+mch);
 const nums=await p.$$eval('.chap .card .ord',e=>e.map(x=>x.textContent));ok(nums.join()===[...Array(15)].map((_,i)=>i+1).join(),tag+' lessons numbered through the year');
 await p.click('.tab[data-t="swedish"]');await p.waitForTimeout(200);
 ok((await p.$$eval('.chap',e=>e.map(x=>x.querySelectorAll('.card').length))).join()==='4,4,4',tag+' Svenska Åk 4: 3 chapters of 4');
 await p.click('.tab[data-t="fys"]');await p.waitForTimeout(200);
 ok((await p.$$('.chap'))
   .length===3&&!!(await p.$('.chap[data-c="fys4-ljus"] .csoon')),tag+' Fysik: 3 chapters, one still to come');
 await p.click('.tab[data-t="kemi"]');await p.waitForTimeout(200);ok(!!(await p.$('.card[data-l="matter"]')),tag+' Kemi holds the matter lesson');

 /* tests */
 await p.click('#mode button[data-m="prov"]');await p.waitForTimeout(200);
 const ex=await p.$$eval('.excard',e=>e.map(x=>x.dataset.e+(x.classList.contains('locked')?':L':'')));
 ok(ex.length>=10&&ex.every(x=>x.endsWith(':L')),tag+' every test locked at the start '+ex.length);
 ok(ex.includes('prov-m4-tal:L')&&ex.includes('prov-math4:L')&&ex.includes('prov4kropp:L'),tag+' chapter, subject and body tests listed');
 await p.click('.excard[data-e="prov-m4-tal"]');await p.waitForTimeout(200);ok(!(await p.$('#prog')),tag+' a locked test does not open');
 /* finishing the chapter's lessons opens its test */
 await p.evaluate(()=>{S.lessons.pv4={stars:2};S.lessons.round={stars:1};map()});await p.waitForTimeout(200);
 ok(!(await p.$eval('.excard[data-e="prov-m4-tal"]',e=>e.classList.contains('locked'))),tag+' chapter done: its test opens');
 await p.click('.excard[data-e="prov-m4-tal"]');await p.waitForTimeout(400);
 ok((await p.$$eval('#prog i',e=>e.length))===8,tag+' chapter test has 8 questions');
 await p.evaluate(()=>map());await p.waitForTimeout(200);
 /* the parents page: unlock a test early, make an own test */
 await p.evaluate(()=>parents());await p.waitForTimeout(300);
 ok(!!(await p.$('#padmin')),tag+' parents page has the tests section');
 await p.click('#padmin button[data-u="prov-sv4-ord"]');await p.waitForTimeout(150);
 ok(await p.evaluate(()=>!!S.unlock['prov-sv4-ord']),tag+' parent unlocked a Svenska test');
 await p.check('#padmin input[data-c="m4-brak"]');await p.check('#padmin input[data-c="bio4-kropp"]');await p.selectOption('#ownn','15');await p.click('#ownsave');await p.waitForTimeout(150);
 const own=await p.evaluate(()=>S.ownExam);ok(own&&own.n===15&&own.ids.includes('fractions')&&own.ids.includes('no4c'),tag+' own test saved '+JSON.stringify(own&&own.ids));
 await p.screenshot({path:`${D}/${tag}-parents.png`,fullPage:true});
 await p.evaluate(()=>map());await p.waitForTimeout(200);
 ok(!(await p.$eval('.excard[data-e="prov-sv4-ord"]',e=>e.classList.contains('locked'))),tag+' unlocked test is open in Prov');
 await p.click('.excard[data-e="prov-eget"]');await p.waitForTimeout(400);
 ok((await p.$$eval('#prog i',e=>e.length))===15,tag+' own test has 15 questions');
 await p.evaluate(()=>map());await p.waitForTimeout(200);await p.screenshot({path:`${D}/${tag}-prov.png`,fullPage:true});
 await p.click('#mode button[data-m="les"]');await p.waitForTimeout(150);

 /* the lesson card: on a laptop Olle sits right of the board, on a phone under it; one screen, no scrolling */
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(150);
 await p.click('.card[data-l="no4c"]');await p.waitForTimeout(400);
 const L=await p.evaluate(()=>{const st=document.querySelector('#stage').getBoundingClientRect(),tc=document.querySelector('.lcard .teacher').getBoundingClientRect();
   return{below:tc.top>=st.bottom-1,beside:tc.left>=st.right-1,sw:Math.round(st.width),scroll:document.documentElement.scrollHeight>innerHeight+1}});
 ok((tag==='laptop'?L.beside:L.below)&&!L.scroll,tag+(tag==='laptop'?' explanation beside':' explanation under')+' the board, no scrolling '+JSON.stringify(L));
 if(tag==='laptop')ok(L.sw>=700,tag+' board is wide: '+L.sw+'px');
 /* the circulation scene keeps moving */
 await p.evaluate(()=>{active.wb.fast=true;return active.step(3)});await p.waitForTimeout(400);
 const mv=await p.evaluate(()=>({m:document.querySelectorAll('#ink animateMotion').length,t:document.querySelectorAll('#ink animateTransform').length,c:document.querySelectorAll('#ink circle').length}));
 if(rm==='reduce')ok(mv.m===0&&mv.t===0&&mv.c>=16,tag+' reduced motion: still dots, nothing moves '+JSON.stringify(mv));
 else{ok(mv.m>=16&&mv.t===1,tag+' blood flows and the heart beats '+JSON.stringify(mv));
  const pos=async()=>p.evaluate(()=>[...document.querySelectorAll('#ink circle')].slice(0,3).map(c=>{const r=c.getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y)}).join(' '));
  const a=await pos();await p.waitForTimeout(600);const bpos=await pos();ok(a!==bpos,tag+' the dots move: '+a+' → '+bpos)}
 await p.screenshot({path:`${D}/${tag}-blood.png`});
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
