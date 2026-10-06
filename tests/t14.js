// Years 6-9: start in each year, take the placement test, open a lesson and practise; mobile layout with six year tabs
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/shots6';fs.mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch();
const mk=async(w,h)=>{const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});
 p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>m.type()==='error'&&p.errs.push(m.text()));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
 await p.evaluate(()=>LESSONS.forEach(l=>{if(l.gen){const g0=l.gen;l.gen=lv=>{const g=g0(lv);window.__g=g;return g}}}));
 return p};
async function answer(p,right){const g=await p.evaluate(()=>{const g=window.__g;return{kind:g.kind,ans:g.ans,n:g.opts?g.opts.length:0}});
 if(g.kind==='choice'){await p.click(`.ch[data-j="${right?g.ans:(g.ans+1)%g.n}"]`)}
 else{if(Array.isArray(g.ans)){await p.fill('#an',String(g.ans[0]));await p.fill('#ad',String(g.ans[1]))}else await p.fill('#an',String(right?g.ans:g.ans+1));await p.click('#chk')}
 await p.waitForTimeout(150)}
const closePop=async p=>{for(let k=0;k<6;k++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(250)}else break}};
for(const y of [6,7,8,9]){const p=await mk(900,1100);
 await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Test');await p.click(`#gr button[data-g="${y}"]`);await p.click('#go');await p.waitForTimeout(300);
 const n=await p.$$eval('.card',x=>x.length);
 await p.click('#pgo');await p.waitForTimeout(300);let q=0;
 while(await p.$('#chk, .ch')){await answer(p,q%3!==2);q++;if(!(await p.$('#nx')))break;await p.click('#nx');await p.waitForTimeout(150);if(q>40)break}
 await closePop(p);await p.waitForTimeout(200);if(await p.$('#mapb')){await p.click('#mapb');await p.waitForTimeout(300)}
 const s=await p.evaluate(y=>({place:JSON.stringify(S.places[y]),known:Object.keys(S.lessons).filter(k=>S.lessons[k].known).length}),y);
 await p.screenshot({path:`${D}/map-${y}.png`,fullPage:true});
 const id=await p.$eval('.card',c=>c.dataset.l);await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(200);
 for(let k=0;k<12&&!(await p.$('#chk')||await p.$('.ch'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(120)}
 await answer(p,true);const ok=await p.evaluate(id=>(S.lessons[id]||{}).level!==undefined||S.tot.ok>0,id);
 console.log(`year ${y}: cards ${n}, placement questions ${q}, place ${s.place}, known ${s.known}, practised ${id} ok=${ok}, errors`,p.errs);await p.close()}
const m=await mk(390,844);await m.click('#langs button[data-l="ar"]');await m.fill('#nm','علي');await m.click('#gr button[data-g="9"]');await m.click('#go');await m.waitForTimeout(300);
await m.screenshot({path:`${D}/mobile-ar-9.png`,fullPage:true});
console.log('mobile scrollWidth',await m.evaluate(()=>document.documentElement.scrollWidth),'errors',m.errs);
await b.close()})();
