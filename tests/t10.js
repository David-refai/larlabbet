const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/shots3';fs.mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch();
const mk=async(w,h)=>{const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});
 p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>m.type()==='error'&&p.errs.push(m.text()));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.addInitScript(()=>{const t=setInterval(()=>{if(window.LESSONS&&LESSONS.length&&LESSONS.some(l=>l.gen)){clearInterval(t)}},5)});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
 await p.evaluate(()=>LESSONS.forEach(l=>{if(l.gen){const g0=l.gen;l.gen=lv=>{const g=g0(lv);window.__g=g;return g}}}));
 return p};
const closePop=async p=>{for(let k=0;k<5;k++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(300)}else break}};
async function answer(p,right){const g=await p.evaluate(()=>{const g=window.__g;return{kind:g.kind,ans:g.ans,n:g.opts?g.opts.length:0}});
 if(g.kind==='choice'){await p.click(`.ch[data-j="${right?g.ans:(g.ans+1)%g.n}"]`)}
 else{if(Array.isArray(g.ans)){await p.fill('#an',String(g.ans[0]+(right?0:1)));await p.fill('#ad',String(g.ans[1]))}else await p.fill('#an',String(right?g.ans:g.ans+1));await p.click('#chk')}
 await p.waitForTimeout(200)}
const st=p=>p.evaluate(()=>JSON.parse(JSON.stringify(S)));
const shot=(p,n)=>p.screenshot({path:`${D}/${n}.png`,fullPage:true});

const p=await mk(900,1100);
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Sara');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
await shot(p,'1-map-new');
await p.click('#pgo');await p.waitForTimeout(300);await shot(p,'2-place-q1');
for(let k=0;k<4;k++){await answer(p,true);await p.click('#nx');await p.waitForTimeout(150)}
await p.click('#skip');await p.waitForTimeout(150);await shot(p,'3-place-skip');await p.click('#nx');await p.waitForTimeout(150);
await p.click('#skip');await p.waitForTimeout(150);console.log('label after 2 wrong:',await p.textContent('#nx'));await p.click('#nx');await p.waitForTimeout(400);
await shot(p,'4-place-end');let s=await st(p);console.log('place',JSON.stringify(s.place),'known',Object.keys(s.lessons).filter(k=>s.lessons[k].known).join(','),'badges',Object.keys(s.badges));
await closePop(p);await p.click('#mapb');await p.waitForTimeout(300);await shot(p,'5-map-after');
// lesson div: go to practice, one wrong, two right
await p.click('.card[data-l="div"]');await p.waitForTimeout(200);
for(let k=0;k<12&&!(await p.$('#chk')||await p.$('.ch'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(120)}
await answer(p,false);await p.click('#nx');await p.waitForTimeout(150);await answer(p,true);await p.click('#nx');await p.waitForTimeout(150);
await p.click('#help');await p.waitForTimeout(200);await answer(p,true);await p.click('#nx');await p.waitForTimeout(300);await closePop(p);
s=await st(p);console.log('after div practice: mist',JSON.stringify(s.mist),'tot',JSON.stringify(s.tot),'div',JSON.stringify(s.lessons.div),'badges',Object.keys(s.badges));
await p.click('#mapb');await p.waitForTimeout(300);await shot(p,'6-map-mist');
await p.click('#tnotes');await p.waitForTimeout(300);await shot(p,'7-notes-q');await answer(p,true);await p.waitForTimeout(200);await shot(p,'8-notes-fixed');await p.click('#nx');await p.waitForTimeout(300);
s=await st(p);console.log('after notes: mist',JSON.stringify(s.mist),'fixed',s.fixed);
await p.click('#mapb');await p.waitForTimeout(200);
await p.click('#tdaily');await p.waitForTimeout(300);
for(let k=0;k<5;k++){await answer(p,k!==2);await p.click('#nx');await p.waitForTimeout(150)}
await p.waitForTimeout(300);await shot(p,'9-daily-end');s=await st(p);console.log('daily',JSON.stringify(s.daily),'mist',Object.keys(s.mist));
await closePop(p);await p.click('#mapb');await p.waitForTimeout(300);await shot(p,'10-map-daily');
// fake a week of history for the parents chart
await p.evaluate(()=>{for(let k=1;k<7;k++){const d=daysAgo(k);S.days[d]={sec:[0,420,900,300,0,1260,600][k]||0,q:k*3,ok:k*2}}S.days[today()].sec=780;saveLocal()});
await p.click('#tbadges');await p.waitForTimeout(300);await shot(p,'11-badges');await p.click('#back');
await p.click('#tpar');await p.waitForTimeout(300);await shot(p,'12-parents-sv');
for(const l of ['en','ar']){await p.click(`#langs button[data-l="${l}"]`);await p.waitForTimeout(300);await shot(p,`13-parents-${l}`);await p.click('#back');await p.waitForTimeout(200);await shot(p,`14-map-${l}`);await p.click('#tpar');await p.waitForTimeout(200)}
// badge popup look
await p.evaluate(()=>{delete S.badges.hundred;S.tot.ok=100;checkBadges()});await p.waitForTimeout(400);await p.screenshot({path:`${D}/15-badgepop.png`});
console.log('errors',p.errs);
// mobile
const m=await mk(390,844);await m.click('#langs button[data-l="sv"]');await m.fill('#nm','Ali');await m.click('#gr button[data-g="4"]');await m.click('#go');await m.waitForTimeout(300);
await shot(m,'16-mobile-map');await m.click('#pgo');await m.waitForTimeout(300);await shot(m,'17-mobile-place');
const sw=await m.evaluate(()=>document.documentElement.scrollWidth);console.log('mobile scrollWidth',sw,'errors',m.errs);
// cloud merge unit check
console.log('merge',await m.evaluate(()=>{const a=fresh(),b=Object.assign(fresh(),{name:"Sara",grade:4,upd:5,lessons:{pv4:{stars:2,level:1}},xp:40,lang:"en"});const r=mergeState(a,b);return JSON.stringify({n:r.name,g:r.grade,l:r.lessons,xp:r.xp,lang:r.lang})}));
await b.close()})();
