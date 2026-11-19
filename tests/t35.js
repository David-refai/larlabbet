// Snabbmatte (David 2026-11-19): a topic in one lesson, in parts. Each part: boards, worked examples, then 5 questions,
// then the next part. Chips in the lesson header (and on the Snabbmatte page) jump straight to a part.
// SHOTS=dir saves a picture of every board.
const {chromium}=require(process.env.PW);
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const ID=process.env.QID||'qbrak',SHOTS=process.env.SHOTS;
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.ONE_TRY=true});
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/jsdelivr/,r=>r.abort());
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);
await p.fill('#nm','Test');await p.click('#gr button[data-g="6"]');await p.click('#go');await p.waitForTimeout(300);
if(await p.$('#pskip')){await p.click('#pskip');await p.waitForTimeout(200)}
await p.click('#mode button[data-m="quick"]');await p.waitForTimeout(300);
ok(await p.$$eval('.qtopic',e=>e.length)===6,'Snabbmatte page lists 6 topics');
const nParts=await p.evaluate(id=>LESSONS.find(l=>l.id===id).parts.length,ID);
ok(await p.$$eval(`.qtopic[data-q="${ID.slice(1)}"] .qchips button`,e=>e.length)===nParts,'part chips on the page');
/* every drill question: keep the generated problem so the test can answer it */
await p.evaluate(id=>{const l=LESSONS.find(x=>x.id===id);l.steps.forEach(s=>{if(s.drill){const g0=s.drill.gen;s.drill.gen=n=>{const g=g0(n);window.__g=g;return g}}})},ID);
/* the drawing of a step: nothing outside the board, no text on top of other text */
const check=()=>p.evaluate(()=>{const ink=document.querySelector('#stage svg #ink'),out=[],T=[...ink.querySelectorAll('text')].map(t=>{const r=t.getBBox();return{s:t.textContent,x:r.x,y:r.y,w:r.width,h:r.height}});
  for(const t of T)if(t.x<-2||t.y<-2||t.x+t.w>802||t.y+t.h>502)out.push('outside: '+t.s);
  for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const a=T[i],c=T[j],ix=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),iy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
    if(ix>6&&iy>a.h*.35&&iy>c.h*.35)out.push(`overlap: "${a.s}" / "${c.s}"`)}
  return out});
await p.click(`.qtopic[data-q="${ID.slice(1)}"] .qhead`);await p.waitForTimeout(400);
ok(!!(await p.$('#qparts .qp.on')),'lesson shows its parts, the first is on');
const steps=await p.evaluate(id=>LESSONS.find(l=>l.id===id).steps.length,ID);
let drills=0,qs=0,bad=[],shot=0;
for(let k=0;k<steps+2;k++){
  if(await p.$('#mapb'))break;
  if(await p.$('#chk, .ch')){drills++;
    for(let n=0;n<5;n++){const g=await p.evaluate(()=>{const g=window.__g;return{kind:g.kind,ans:g.ans,show:g.show}});
      if(SHOTS&&n%2===0){await p.locator('#stage').screenshot({path:`${SHOTS}/${ID}-${String(++shot).padStart(2,'0')}-q.png`})}
      if(g.kind==='choice')await p.click(`.ch[data-j="${g.ans}"]`);
      else if(g.kind==='frac'||g.kind==='pair'){await p.fill('#an',String(g.ans[0]));await p.fill('#ad',String(g.ans[1]));await p.click('#chk')}
      else{await p.fill('#an',String(g.ans).replace('.',','));await p.click('#chk')}
      await p.waitForTimeout(120);qs++;
      if(!(await p.textContent('#ctrl')).includes('✓'))bad.push(JSON.stringify(g));
      if(await p.$('#sol')){await p.click('#sol');await p.waitForTimeout(60);const c=await check();if(c.length)bad.push('solution: '+c.join(', '))
        ;if(SHOTS&&n===4)await p.locator('#stage').screenshot({path:`${SHOTS}/${ID}-${String(++shot).padStart(2,'0')}-sol.png`})}
      await p.click('#nx');await p.waitForTimeout(150)}
    continue}
  await p.waitForTimeout(80);const c=await check();if(c.length)bad.push(`step ${k}: `+c.join(', '));
  if(SHOTS)await p.locator('#stage').screenshot({path:`${SHOTS}/${ID}-${String(++shot).padStart(2,'0')}.png`});
  await p.evaluate(()=>{const n=document.querySelector('#next');n.disabled=false;n.click()});await p.waitForTimeout(150);
}
ok(drills===nParts-1||drills===nParts,`went through every drill (${drills})`);
ok(bad.length===0,'every right answer accepted, boards fit: '+bad.slice(0,6).join(' | '));
ok(!!(await p.$('#mapb'))&&(await p.$$eval('.stars span:not(.off)',e=>e.length))===3,'end: three stars after all right');
/* chips jump to a part */
await p.evaluate(id=>lesson(id),ID);await p.waitForTimeout(300);
await p.click('#qparts .qp[data-k="2"]');await p.waitForTimeout(300);
ok(await p.$eval('#qparts .qp[data-k="2"]',e=>e.classList.contains('on')),'header chip jumps to part 3');
await p.evaluate(id=>map(),ID);await p.waitForTimeout(300);
await p.click(`.qtopic[data-q="${ID.slice(1)}"] .qchips button[data-k="1"]`);await p.waitForTimeout(300);
ok(await p.$eval('#qparts .qp[data-k="1"]',e=>e.classList.contains('on')),'page chip opens the lesson at part 2');
/* jumping away from a half-done drill leaves no answer box behind */
const at=await p.evaluate(id=>LESSONS.find(l=>l.id===id).steps.findIndex(s=>s.drill),ID);
await p.evaluate(([id,k])=>lesson(id,k),[ID,at]);await p.waitForTimeout(300);ok(!!(await p.$('#chk, .ch')),'a drill opens with an answer box');
await p.click('#qparts .qp[data-k="0"]');await p.waitForTimeout(300);ok(!(await p.$('#chk, .ch'))&&!(await p.$eval('#next',e=>e.hidden)),'chip leaves the drill cleanly');
ok(errs.length===0,'no page errors '+errs.join('; '));
await b.close()})();
