// Year 1 voice: record a letter with a (fake) microphone, play it back, keep it after a reload
const {chromium}=require(process.env.PW);const D=process.argv[2];const shot=(p,f)=>D?p.screenshot({path:D+'/'+f}):0;
(async()=>{const b=await chromium.launch({args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:900,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__said=[];const A=window.Audio;window.Audio=function(u){const a=new A(u);window.__said.push('clip');return a}});
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
await p.click('#langs button[data-l="sv"]');await p.fill('#nm','Mira');await p.click('#gr button[data-g="1"]');await p.click('#go');await p.waitForTimeout(400);
await p.click('#lrec');await p.waitForTimeout(300);await shot(p,'r0.png');
const row=p.locator('.lrecrow').first();await row.locator('[aria-label=record]').click({force:true});await p.waitForTimeout(1200);await row.locator('[aria-label=record]').click({force:true});await p.waitForTimeout(800);
console.log('ok rows',await p.$$eval('.lrecrow.ok',e=>e.length));
await p.click('[aria-label=home]');await p.click('#tABC');await p.waitForTimeout(500);await p.click('#lsay');await p.waitForTimeout(300);
console.log('clips played',await p.evaluate(()=>window.__said.length));await shot(p,'r1.png');
await p.reload();await p.waitForTimeout(800);await p.click('#lrec');await p.waitForTimeout(500);console.log('after reload ok rows',await p.$$eval('.lrecrow.ok',e=>e.length));
const ok=await p.$$eval('.lrecrow.ok',e=>e.length);console.log(ok===1&&!errs.length?'PASS no page errors':'FAIL '+ok+' '+errs);await b.close()})();
