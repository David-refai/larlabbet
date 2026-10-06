// Memory: spaced review, mixing an earlier lesson into practice, "Remind me", and "sits" after a week
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/shots7';fs.mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:900,height:1100},reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
await p.evaluate(()=>LESSONS.forEach(l=>{if(l.gen){const g0=l.gen;l.gen=lv=>{const g=g0(lv);g.__id=l.id;window.__g=g;return g}}}));
const shot=n=>p.screenshot({path:`${D}/${n}.png`,fullPage:true});
async function answer(right){const g=await p.evaluate(()=>{const g=window.__g;return{kind:g.kind,ans:g.ans,n:g.opts?g.opts.length:0,id:g.__id}});
 if(g.kind==='choice'){await p.click(`.ch[data-j="${right?g.ans:(g.ans+1)%g.n}"]`)}
 else{if(Array.isArray(g.ans)){await p.fill('#an',String(g.ans[0]+(right?0:1)));await p.fill('#ad',String(g.ans[1]))}else await p.fill('#an',String(right?g.ans:g.ans+1));await p.click('#chk')}
 await p.waitForTimeout(150);return g.id}
const closePop=async()=>{for(let k=0;k<6;k++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(250)}else break}};
const toPractice=async id=>{await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(200);for(let k=0;k<12&&!(await p.$('#chk')||await p.$('.ch'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(120)}};
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Sara');await p.click('#gr button[data-g="5"]');await p.click('#go');await p.waitForTimeout(300);
await p.click('#pskip');await p.waitForTimeout(200);
// 1. finish lesson 1 -> scheduled for tomorrow
await toPractice('big5');for(let k=0;k<3;k++){await answer(true);await p.click('#nx');await p.waitForTimeout(150)}
await closePop();let r=await p.evaluate(()=>JSON.stringify(S.rev));console.log('after big5:',r,'tomorrow',await p.evaluate(()=>inDays(1)));
await p.click('#mapb');await p.waitForTimeout(200);
// 2. lesson 2: question 3 comes from big5; answer it wrong, use Remind me, then the similar problem
await toPractice('neg');const ids=[];
for(let k=0;k<5;k++){const head=await p.textContent('#say');
  const isMix=/tidigare lektion/.test(head);const id=await answer(!isMix);ids.push(id+(isMix?'(mix)':''));
  if(isMix){await shot('1-mix-wrong');const rem=await p.$('#rem');console.log('remind button',!!rem);await rem.click();await p.waitForTimeout(300);await shot('2-remind');
    while(await p.$('#rmore')){await p.click('#rmore');await p.waitForTimeout(200)}await p.click('#rtry');await p.waitForTimeout(200);console.log('retry head:',(await p.textContent('#say')).slice(0,60));
    ids.push((await answer(true))+'(retry)')}
  if(!(await p.$('#nx')))break;const lbl=await p.textContent('#nx');await p.click('#nx');await p.waitForTimeout(150);if(/Klar|Avsluta|Färdig/.test(lbl)||!(await p.$('#chk, .ch')))break}
await closePop();await shot('3-neg-end');
r=await p.evaluate(()=>({rev:S.rev,neg:S.lessons.neg,mist:Object.keys(S.mist)}));console.log('questions',ids.join(' '),'| rev',JSON.stringify(r.rev),'| neg',JSON.stringify(r.neg),'| mist',r.mist);
// 3. a week later: big5 due -> map tag, daily review answers it right -> sits
await p.evaluate(()=>{S.rev.big5.first=daysAgo(8);S.rev.big5.due=daysAgo(5);S.rev.neg.due=today();saveLocal()});
await p.click('#mapb');await p.waitForTimeout(250);await shot('4-map-due');
console.log('map tags',await p.$$eval('.mem',x=>x.map(e=>e.closest('.card').dataset.l+':'+e.textContent)),'| daily text',await p.textContent('#tdaily .muted'));
await p.click('#tdaily');await p.waitForTimeout(300);const plan=[];
for(let k=0;k<5;k++){plan.push(await answer(true));await p.click('#nx');await p.waitForTimeout(150)}
await closePop();await p.waitForTimeout(1200);
r=await p.evaluate(()=>({rev:S.rev,big5:S.lessons.big5}));console.log('daily plan',plan.join(','),'| rev',JSON.stringify(r.rev),'| big5',JSON.stringify(r.big5));
await p.click('#mapb');await p.waitForTimeout(250);await shot('5-map-sits');
console.log('map tags',await p.$$eval('.mem',x=>x.map(e=>e.closest('.card').dataset.l+':'+e.textContent)));
await p.click('#tpar');await p.waitForTimeout(300);await shot('6-parents');console.log('parents tile',await p.textContent('.tile'));
for(const l of ['en','ar']){await p.click(`#langs button[data-l="${l}"]`);await p.waitForTimeout(300);await shot(`7-parents-${l}`);await p.click('#back');await p.waitForTimeout(200);await shot(`8-map-${l}`);await p.click('#tpar');await p.waitForTimeout(200)}
// 4. old progress without a schedule is filled in; merge keeps the schedule
console.log('fill+merge',await p.evaluate(()=>{const a=fresh();a.grade=5;a.lessons={colmul:{stars:2,level:1},shortdiv:{known:true}};const keep=S;S=a;revFill();const out=JSON.stringify(S.rev);S=keep;
  const m=mergeState(Object.assign(fresh(),{grade:5,upd:1,rev:{x:{box:2}}}),Object.assign(fresh(),{grade:5,upd:2,rev:{y:{box:1}}}));return out+' | merged '+Object.keys(m.rev).join(',')}));
console.log('errors',errs);await b.close()})();
