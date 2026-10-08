// Year 1 lessons: a letter from intro to animal (6 tracing sheets), a number with counting, and the words drag game
const {chromium}=require(process.env.PW);const D=process.argv[2];const shot=(p,f)=>D?p.screenshot({path:D+'/'+f}):0;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Mira');await p.click('#gr button[data-g="1"]');await p.click('#go');await p.waitForTimeout(400);
await shot(p,'l0.png');
async function traceOnce(){for(let s=0;s<6;s++){const pts=await p.evaluate(()=>{const svg=document.querySelector('#lpaper');if(!svg)return null;const el=svg.querySelector('path.now');if(!el)return null;const m=svg.getScreenCTM(),L=el.getTotalLength(),o=[];for(let i=0;i<=30;i++){const q=el.getPointAtLength(L*i/30);const r=new DOMPoint(q.x,q.y).matrixTransform(m);o.push([r.x,r.y])}return o});
  if(!pts)break;await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts)await p.mouse.move(...q,{steps:2});await p.mouse.up();await p.waitForTimeout(120);}await p.waitForTimeout(800);}
await p.click('#tABC');await p.waitForTimeout(400);await shot(p,'l1.png');
await p.click('#lstart');await p.waitForTimeout(300);
for(let k=0;k<6;k++){if(k==2)await shot(p,'l2.png');if(k==4)await shot(p,'l3.png');await traceOnce();}
await p.waitForTimeout(500);await shot(p,'l4.png');console.log('party',!!await p.$('.lparty'),await p.evaluate(()=>S.little.t));
await p.click('#lnext');await p.waitForTimeout(300);console.log('now',await p.textContent('#lsay'));
await p.click('[aria-label=home]');await p.click('#t123');await p.click('.lchip:nth-child(4)');await p.waitForTimeout(300);await p.click('#lstart');for(let k=0;k<3;k++)await traceOnce();await p.waitForTimeout(3600);await shot(p,'l5.png');
await p.click('[aria-label=home]');await p.click('#twords');await p.waitForTimeout(400);await shot(p,'w0.png');
for(let r=0;r<3;r++){const k=await p.$eval('.lwcard',e=>e.dataset.w);const c=await (await p.$('.lwcard')).boundingBox();const t=await (await p.$(`.lzooa[data-animal="${k}"]`)).boundingBox();
 await p.mouse.move(c.x+c.width/2,c.y+c.height/2);await p.mouse.down();await p.mouse.move(t.x+t.width/2,t.y+t.height/2,{steps:8});if(r==0)await shot(p,'w1.png');await p.mouse.up();await p.waitForTimeout(300);}
await p.waitForTimeout(900);console.log('words won',!!await p.$('.lparty'));
const ok=await p.evaluate(()=>S.little.t);console.log(ok.ABCA&&ok['1233']&&ok.words&&!errs.length?'PASS no page errors':'FAIL '+JSON.stringify(ok)+errs);await b.close()})();
