// v45 story as a book: the first page opens from a cover, Next turns a page (a leaf turns at the spine and is gone after),
// Prev turns back, a swipe turns a page on a phone, and reduced motion shows no leaf.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/v45';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm,touch] of [[1366,768,'laptop','no-preference',false],[390,844,'phone','no-preference',true],[390,844,'still','reduce',true]]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm,hasTouch:touch});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
 await p.click('.tab[data-t="swedish"]');await p.waitForTimeout(200);await p.click('.card[data-l="sv4g"]');
 await p.waitForTimeout(300);
 const leaf=()=>p.$$eval('.svleaf',e=>e.map(x=>x.className));
 const l0=await leaf();await p.screenshot({path:D+'/'+tag+'-cover.png'});
 ok(rm==='reduce'?l0.length===0:l0.length===1&&!!(await p.$('.svface.iscover')),tag+' first page opens from a cover '+l0);
 await p.waitForTimeout(1300);ok((await leaf()).length===0,tag+' cover gone after the turn');
 await p.screenshot({path:D+'/'+tag+'-page1.png'});
 await p.click('#next');await p.waitForTimeout(380);const l1=await leaf();await p.screenshot({path:D+'/'+tag+'-turning.png'});
 ok(rm==='reduce'?l1.length===0:l1.length===1,tag+' Next turns a page '+l1);
 await p.waitForTimeout(1000);ok((await p.$eval('.svnum',e=>e.textContent))==='2/5',tag+' on page 2');
 await p.click('#prev');await p.waitForTimeout(300);const l2=await leaf();
 ok(rm==='reduce'?l2.length===0:l2.length===1&&(tag==='phone'||l2[0].includes('left')),tag+' Prev turns back '+l2);
 await p.waitForTimeout(1000);ok((await p.$eval('.svnum',e=>e.textContent))==='1/5',tag+' back on page 1');
 if(touch){const r=await p.$eval('.svstory',e=>{const b=e.getBoundingClientRect();return[b.x+b.width/2,b.y+b.height/2]});
  await p.evaluate(([x,y])=>{const el=document.querySelector('.svstory'),T=(cx)=>[new Touch({identifier:1,target:el,clientX:cx,clientY:y})];
   el.dispatchEvent(new TouchEvent('touchstart',{touches:T(x+120),changedTouches:T(x+120),bubbles:true}));
   el.dispatchEvent(new TouchEvent('touchend',{touches:[],changedTouches:T(x-80),bubbles:true}))},r);
  await p.waitForTimeout(1000);ok((await p.$eval('.svnum',e=>e.textContent))==='2/5',tag+' a swipe turns the page');}
 ok((await p.$$('.svkeep,.svblank')).length===0,tag+' nothing left over after turns');
 ok(p.errs.length===0,tag+' no page errors '+p.errs.join('|'));await p.close()}
await b.close()})();
