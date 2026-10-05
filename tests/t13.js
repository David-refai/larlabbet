const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/shots5';fs.mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch();
const mk=async(w,h)=>{const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
 await p.evaluate(()=>LESSONS.forEach(l=>{if(l.gen){const g0=l.gen;l.gen=lv=>{const g=g0(lv);window.__g=g;return g}}}));return p};
const p=await mk(900,1100);
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Omar');await p.click('#gr button[data-g="5"]');await p.click('#go');await p.waitForTimeout(300);
await p.screenshot({path:`${D}/1-map5.png`,fullPage:true});console.log('h2:',await p.textContent('.course h2'),'| cards',await p.$$eval('.card',x=>x.length));
await p.click('#pgo');await p.waitForTimeout(200);const n=await p.$$eval('#prog i',x=>x.length);console.log('probes',n);
for(let k=0;k<3;k++){const g=await p.evaluate(()=>({kind:window.__g.kind,ans:window.__g.ans,n:window.__g.opts?window.__g.opts.length:0}));
 if(g.kind==='choice')await p.click(`.ch[data-j="${g.ans}"]`);else{if(Array.isArray(g.ans)){await p.fill('#an',String(g.ans[0]));await p.fill('#ad',String(g.ans[1]))}else await p.fill('#an',String(g.ans));await p.click('#chk')}
 await p.waitForTimeout(150);await p.click('#nx');await p.waitForTimeout(150)}
await p.click('#skip');await p.click('#nx');await p.click('#skip');await p.click('#nx');await p.waitForTimeout(300);
console.log('places',await p.evaluate(()=>JSON.stringify(S.places)));await p.screenshot({path:`${D}/2-place5-end.png`});
await p.click('#bpop').catch(()=>{});await p.waitForTimeout(300);await p.click('#mapb');await p.waitForTimeout(300);await p.screenshot({path:`${D}/3-map5-after.png`,fullPage:true});
// neg lesson: ± key
await p.click('.card[data-l="neg"]');await p.waitForTimeout(200);for(let k=0;k<12&&!(await p.$('#chk'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(100)}
const g=await p.evaluate(()=>window.__g.ans);await p.fill('#an',String(Math.abs(g)));if(g<0)await p.click('#sgn');console.log('neg ans',g,'typed',await p.inputValue('#an'));await p.click('#chk');await p.waitForTimeout(200);console.log('neg verdict',await p.textContent('#ctrl'));
await p.screenshot({path:`${D}/4-neg.png`});await p.click('#back');
// fraceq level 1 simplest
await p.evaluate(()=>{S.lessons.fraceq={stars:0,level:1};save()});await p.click('.card[data-l="fraceq"]');await p.waitForTimeout(200);for(let k=0;k<12&&!(await p.$('#chk'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(100)}
const f=await p.evaluate(()=>({ans:window.__g.ans,s:window.__g.simplest,t:window.__g.q.filter(a=>a.t==="text").map(a=>a.s).join("|")}));console.log('fraceq',JSON.stringify(f));
await p.fill('#an',String(f.ans[0]*2));await p.fill('#ad',String(f.ans[1]*2));await p.click('#chk');await p.waitForTimeout(200);console.log('unsimplified verdict',await p.textContent('#ctrl'));await p.click('#back');
// year switch + parents
await p.click('#years button[data-y="4"]');await p.waitForTimeout(200);console.log('after switch h2:',await p.textContent('.course h2'));
await p.click('#tpar');await p.waitForTimeout(200);await p.screenshot({path:`${D}/5-parents.png`,fullPage:true});await p.click('#years button[data-y="5"]');await p.waitForTimeout(200);console.log('parents rows',await p.$$eval('.ptable tbody tr',x=>x.length));
await p.click('#langs button[data-l="ar"]');await p.waitForTimeout(200);await p.click('#back');await p.waitForTimeout(200);await p.screenshot({path:`${D}/6-map5-ar.png`,fullPage:true});
console.log('errors',p.errs);
const m=await mk(390,844);await m.click('#langs button[data-l="sv"]');await m.click('#gr button[data-g="5"]');await m.click('#go');await m.waitForTimeout(300);await m.screenshot({path:`${D}/7-mobile.png`});
console.log('mobile scrollWidth',await m.evaluate(()=>document.documentElement.scrollWidth),m.errs);await b.close()})();
