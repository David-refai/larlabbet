// Lesson fits one screen: board, explanation and Next visible without scrolling (laptop, tablet, phone)
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/fit';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag] of [[1366,768,'laptop'],[1280,650,'small-laptop'],[820,1180,'tablet'],[390,844,'phone'],[360,640,'small-phone']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Test');await p.click('#gr button[data-g="7"]');await p.click('#go');await p.waitForTimeout(300);
 for(const id of ['int7','dec5'].filter(Boolean)){
  const has=await p.evaluate(id=>!!LESSONS.find(l=>l.id===id),id);if(!has)continue;
  await p.evaluate(id=>lesson(id),id);await p.waitForTimeout(600);
  for(let k=0;k<3;k++){
   const r=await p.evaluate(()=>{const v=innerHeight,q=s=>document.querySelector(s).getBoundingClientRect();return{stage:q('#stage'),say:q('#say'),next:q('#next'),doc:document.documentElement.scrollHeight,v,sw:document.documentElement.scrollWidth}});
   const fits=r.stage.bottom<=r.v+1&&r.say.bottom<=r.v+1&&r.next.bottom<=r.v+1&&r.stage.top>=0;
   ok(fits&&r.sw<=w,`${tag} ${id} step ${k}: board ${Math.round(r.stage.width)}x${Math.round(r.stage.height)}, text bottom ${Math.round(r.say.bottom)}, next bottom ${Math.round(r.next.bottom)} / ${r.v}`);
   if(k===0)await p.screenshot({path:`${D}/${tag}-${id}.png`});
   await p.evaluate(()=>{const n=document.querySelector('#next');n.disabled=false;n.click()});await p.waitForTimeout(400)}
  for(let k=0;k<12&&!(await p.$('#chk, .ch'));k++){await p.evaluate(()=>{const n=document.querySelector('#next');n.disabled=false;n.click()});await p.waitForTimeout(300)}
  const r=await p.evaluate(()=>{const e=document.querySelector('#chk')||document.querySelector('.ch');const x=e.getBoundingClientRect();return{b:x.bottom,v:innerHeight,st:document.querySelector('#stage').getBoundingClientRect().bottom}});
  ok(r.b<=r.v+1&&r.st<=r.v+1,`${tag} ${id} practice: answer button bottom ${Math.round(r.b)} / ${r.v}`);await p.screenshot({path:`${D}/${tag}-${id}-practice.png`})}
 ok(!p.errs.length,tag+' no errors '+p.errs.join('|'));await p.close()}
await b.close()})();
