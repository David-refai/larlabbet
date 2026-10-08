const {chromium}=require(process.env.PW);// Year 1 page: trace every letter and digit, pop balloons, count animals, draw
const D=process.argv[2];const shot=(p,f)=>D?p.screenshot({path:D+'/'+f}):0;
(async()=>{const bad=[];const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Mira');await p.click('#gr button[data-g="1"]');await p.click('#go');await p.waitForTimeout(500);
await shot(p,'h.png');
await p.click('#tABC');await p.waitForTimeout(700);await shot(p,'a0.png');
// trace each stroke of current glyph via its dotted paths
async function traceAll(){const n=await p.$$eval('#lpaper path',e=>e.length);
 for(let s=0;s<n;s++){const pts=await p.evaluate(()=>{const svg=document.querySelector('#lpaper'),el=svg.querySelector('path.now');if(!el)return null;const m=svg.getScreenCTM(),L=el.getTotalLength(),o=[];for(let i=0;i<=30;i++){const q=el.getPointAtLength(L*i/30);const r=new DOMPoint(q.x,q.y).matrixTransform(m);o.push([r.x,r.y])}return o});
  if(!pts)break;await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts)await p.mouse.move(...q,{steps:2});await p.mouse.up();await p.waitForTimeout(150);}}
await p.mouse.move(400,400);
// partial stroke first for screenshot
await traceAll();await p.waitForTimeout(600);await shot(p,'a1.png');
console.log('party',!!await p.$('.lparty'),'stars',await p.evaluate(()=>S.little));
await p.click('#lnext');await p.waitForTimeout(400);console.log('now',await p.textContent('.lbig'));
// go through all letters + digits quickly
for(const set of ['ABC','abc','123']){await p.click('[aria-label=home]');await p.click('#t'+set);await p.waitForTimeout(300);
 const chars=await p.$$eval('.lchip',e=>e.map(x=>x.textContent));const fail=[];
 for(let i=0;i<chars.length;i++){await p.click(`.lchip:nth-child(${i+1})`);await p.waitForTimeout(120);await traceAll();await p.waitForTimeout(150);if(!await p.$('.lparty'))fail.push(chars[i]);else await p.click('#lnext');}
 console.log(set,'fail',fail);if(fail.length)bad.push(set+':'+fail);}
await p.click('[aria-label=home]');await p.click('#tabc');await p.click('.lchip:nth-child(7)');await p.waitForTimeout(300);await shot(p,'g.png');
await p.click('[aria-label=home]');await p.click('#tpop');await p.waitForTimeout(4000);await shot(p,'b.png');
const t=await p.textContent('#ltarget');let n=0;for(let k=0;k<40&&!await p.$('.lparty');k++){const bs=await p.$$(`.lballoon:not(.popped)[data-ch="${t}"]`);for(const x of bs){try{await x.dispatchEvent('pointerdown');n++}catch{}}await p.waitForTimeout(500)}
console.log('balloons won',!!await p.$('.lparty'),n);await p.click('#lnext');
await p.click('[aria-label=home]');await p.click('#tcount');await p.waitForTimeout(800);const cnt=await p.$$eval('.lanimal',e=>e.length);await p.click('.lanimal');await shot(p,'c.png');await p.click(`.lnumbtn[data-n="${cnt}"]`);await p.waitForTimeout(400);console.log('count won',!!await p.$('.lparty'));await p.click('#lnext');
await p.click('[aria-label=home]');await p.click('#tdraw');await p.waitForTimeout(300);await p.mouse.move(200,500);await p.mouse.down();await p.mouse.move(400,600,{steps:10});await p.mouse.up();await shot(p,'d.png');
await p.click('[aria-label=home]');const pe=errs.filter(e=>!/Failed to load resource/.test(e));console.log(bad.length||pe.length?'FAIL '+bad+' '+pe:'PASS no page errors');await b.close()})();
