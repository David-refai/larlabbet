// Practice answers (David 2026-10-23): a wrong answer gets one more try before the solution shows,
// and "Skriv bara ändelsen" also accepts the whole word or the whole sentence ("Amir hoppar ur sängen.").
const {chromium}=require(process.env.PW);
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/jsdelivr/,r=>r.abort());
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
await p.evaluate(()=>LESSONS.forEach(l=>{if(l.gen){const g0=l.gen;l.gen=lv=>{const g=g0(lv);window.__g=g;return g}}}));
await p.evaluate(()=>{const w0=wordQ;wordQ=l=>{const r=w0(l);if(r)window.__g=r.g;return r}});
await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
if(await p.$('#pskip')){await p.click('#pskip');await p.waitForTimeout(200)}
const toPractice=async id=>{await p.evaluate(()=>map());await p.waitForTimeout(200);await p.click('.tab[data-t="swedish"]').catch(()=>{});await p.waitForTimeout(200);
 await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(300);
 for(let k=0;k<30&&!(await p.$('#chk')||await p.$('.ch'));k++){await p.evaluate(()=>{const n=document.querySelector('#next');if(n){n.disabled=false;n.click()}});await p.waitForTimeout(150)}};
const g=()=>p.evaluate(()=>{const g=window.__g;return{kind:g.kind,ans:g.ans,show:g.show,full:g.full||[],n:g.opts?g.opts.length:0}});
const right=async q=>{if(q.kind==='choice')await p.click(`.ch[data-j="${q.ans}"]`);else{await p.fill('#an',String([].concat(q.ans)[0]));await p.click('#chk')}await p.waitForTimeout(150)};
const wrong=async(q,k=1)=>{if(q.kind==='choice')await p.click(`.ch[data-j="${(q.ans+k)%q.n}"]`);else{await p.fill('#an','qqqq');await p.click('#chk')}await p.waitForTimeout(150)};
const next=async()=>{await p.click('#nx');await p.waitForTimeout(200);for(let k=0;k<6;k++){if(await p.$('#bpop:not([hidden])')){await p.click('#bpop');await p.waitForTimeout(200)}else break}};

await toPractice('sv4c');
ok(!!(await p.$('#chk, .ch')),'practice reached');
/* one more try: wrong once keeps the question, wrong twice shows the solution */
let q=await g();await wrong(q);
ok(!(await p.$('#nx'))&&(await p.textContent('#say')).includes('försök igen'),'wrong once: no solution yet, "försök igen"');
if(q.kind==='choice')ok(await p.$eval(`.ch[data-j="${(q.ans+1)%q.n}"]`,e=>e.disabled&&e.classList.contains('wrongpick')),'the wrong choice is crossed out');
await right(q);ok(!!(await p.$('#nx'))&&(await p.textContent('#ctrl')).includes('✓'),'right on the second try counts');
await next();
q=await g();await wrong(q);await wrong(q,2);ok(!!(await p.$('#nx'))&&(await p.textContent('#ctrl')).includes('✗'),'wrong twice: the solution shows');
await next();
/* "write only the ending": the whole sentence is right too (practice made of ending questions only) */
await p.evaluate(()=>{const l=LESSONS.find(x=>x.id==='sv4c'),g0=l.gen;l.gen=lv=>{for(let i=0;i<400;i++){const g=g0(2);if(g.full&&g.full.length){window.__g=g;return g}}return g0(lv)}});
await toPractice('sv4c');
let tested=0;
for(let k=0;k<40&&tested<2&&await p.$('#chk, .ch');k++){q=await g();
 if(q.kind==='text'&&q.full.length){await p.fill('#an',tested?q.show:q.full[0]);await p.click('#chk');await p.waitForTimeout(150);
  ok((await p.textContent('#ctrl')).includes('✓'),`ending question: "${tested?q.show:q.full[0]}" is right`);tested++}
 else await right(q);
 if(await p.$('#nx'))await next()}
ok(tested===2,'met two ending questions ('+tested+')');
ok(!errs.length,'no page errors '+errs.join(' | '));
await b.close()})();
