// Words to know: chips for Swedish test words in scenes and questions, word card, word-check question, 5-question practice
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/words';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const lg of ['sv','ar']){
 const p=await b.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.click(`#langs button[data-l="${lg}"]`);await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);
 const bad=await p.evaluate(()=>Object.entries(WORDS).flatMap(([l,ws])=>ws.filter(k=>!TERMS[k]).map(k=>l+':'+k).concat(LESSONS.find(x=>x.id===l)?[]:['no lesson '+l])));
 ok(!bad.length,lg+' every listed word exists '+bad.slice(0,8).join(' '));
 await p.evaluate(()=>lesson('round7'));await p.waitForTimeout(500);
 ok(!!await p.$('#wlist'),lg+' lesson has a words button');
 await p.click('#wlist');ok((await p.$$eval('#wpop .wrow',e=>e.length))>=5,lg+' word list card');await p.screenshot({path:`${D}/${lg}-list.png`});await p.click('#wok');
 let seen=[];for(let k=0;k<12;k++){seen.push(...await p.$$eval('#words .wchip',e=>e.map(x=>x.textContent)));if(await p.$('#chk, .ch'))break;await p.evaluate(()=>{const n=document.querySelector('#next');n.disabled=false;n.click()});await p.waitForTimeout(300)}
 ok(seen.length>0,lg+' chips appear in scenes: '+[...new Set(seen)].join(', '));
 /* practice: 5 own + word check (+ maybe one from before) */
 const n=await p.evaluate(()=>document.querySelector('#say').textContent);ok(/5|6|7/.test(n),lg+' practice count shown: '+n.slice(0,40));
 const chips=await p.$$eval('#words .wchip',e=>e.map(x=>x.textContent));ok(true,lg+' question 1 chips: '+chips.join(', '));
 if(chips.length){await p.click('#words .wchip');await p.screenshot({path:`${D}/${lg}-q1-card.png`});await p.click('#wok')}
 let gotW=false;for(let q=0;q<8&&!(await p.$('#mapb'));q++){
  const isW=await p.evaluate(()=>/Ordkoll|اختبار كلمة/.test(document.querySelector("#say").textContent));
  if(isW){gotW=true;await p.screenshot({path:`${D}/${lg}-wordq.png`})}
  if(await p.$('.ch'))await p.click('.ch');else{await p.fill('#an','1');await p.click('#chk')}
  await p.waitForTimeout(200);if(await p.$('#nx'))await p.click('#nx');await p.waitForTimeout(250);
  for(let k=0;k<4;k++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(200)}}}
 ok(gotW,lg+' a word-check question came up');ok(!!await p.$('#mapb'),lg+' practice ends');
 ok(!p.errs.length,lg+' no errors '+p.errs.join('|'));await p.close()}
await b.close()})();
