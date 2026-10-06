/* per-child profiles: old save migrates, two children keep separate progress, the account carries them to another device, deleting sticks */
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const store={};const pages=[];
const mk=async(seedLocal,cloud=true)=>{const c=await b.newContext({viewport:{width:900,height:1000},reducedMotion:'reduce'});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));pages.push(p);
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.exposeFunction('__write',(id,body)=>{store[id]=body});await p.exposeFunction('__all',()=>store);
 await p.addInitScript(([seed,cloud])=>{if(seed)localStorage.setItem("larlabbet-v3",seed);if(!cloud)return;
  const col=path=>({get:async()=>{const all=await window.__all();return{docs:Object.keys(all).map(id=>({id,exists:true,data:()=>all[id],metadata:{}}))}},
    doc:id=>({set:async body=>window.__write(id,body)}),onSnapshot:()=>()=>{}});
  window.claude={use:async n=>n==="db"?{collection:col}:n==="user"?{id:async()=>"user123"}:null}},[seedLocal,cloud]);
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(2000);return p};
const kids=p=>p.$$eval('.kid[data-k]',e=>e.map(x=>x.querySelector('b').textContent));

/* the account still has the single-child copy of v13, this browser too */
store.progress={s:{name:"Sara",grade:4,xp:50,lang:"sv",lessons:{round:{stars:2,level:1}},upd:900},upd:900};
const A=await mk(JSON.stringify({name:"Sara",grade:4,xp:120,lang:"sv",lessons:{pv4:{stars:3,level:2}},upd:1000}));
await A.waitForTimeout(1800);
ok(await A.evaluate(()=>S.id==="k0"&&S.lessons.pv4.stars===3&&S.lessons.round.stars===2),'old save + old account copy merge into one child');
ok(await A.evaluate(()=>!localStorage.getItem("larlabbet-v3")&&!!JSON.parse(localStorage.getItem("larlabbet-kids")).kids.k0),'old key moved to profiles');
ok(store['kid-k0']&&store['kid-k0'].s.name==="Sara",'account gets kid-k0');
ok(await A.$eval('h1',e=>e.textContent.includes('Sara')),'one child opens straight to the map');
/* add a second child */
await A.click('#who');ok((await kids(A)).join()==="Sara",'picker lists Sara');
await A.click('#knew');ok(await A.$eval('#nm',e=>e.value===""),'new child starts with an empty name');
await A.fill('#nm','Omar');await A.click('#gr button[data-g="7"]');await A.click('#go');await A.waitForTimeout(1800);
ok(await A.evaluate(()=>S.name==="Omar"&&S.grade===7&&!S.lessons.pv4&&Object.keys(PROF.kids).length===2),'Omar has his own empty progress');
ok(await A.evaluate(()=>PROF.kids.k0.lessons.pv4.stars===3&&PROF.kids.k0.grade===4),'Sara untouched');
await A.evaluate(()=>{S.lessons.eq7={stars:1};save()});await A.waitForTimeout(1800);
const oid=await A.evaluate(()=>S.id);ok(store['kid-'+oid]&&store['kid-'+oid].s.lessons.eq7,'Omar saved to account');
/* reload on this browser: two children, so "who are you?" */
await A.reload();await A.waitForTimeout(2000);
ok((await kids(A)).sort().join()==="Omar,Sara",'reload shows who-are-you with both');
/* another device, empty browser */
const B=await mk(null);
ok((await kids(B)).sort().join()==="Omar,Sara",'second device lists both children from the account');
await B.click(`.kid[data-k="k0"]`);ok(await B.evaluate(()=>S.name==="Sara"&&S.lessons.pv4.stars===3&&!S.lessons.eq7),'Sara on device B has her stars only');
await B.click('#who');await B.click(`.kid[data-k="${oid}"]`);ok(await B.evaluate(()=>S.name==="Omar"&&S.lessons.eq7&&S.grade===7),'Omar on device B');
await B.screenshot({path:'build/shots3/30-kid-map.png'});
await B.click('#who');await B.screenshot({path:'build/shots3/31-who.png'});await B.click(`.kid[data-k="${oid}"]`);
await B.click('#tpar');ok((await B.$$eval('#pkids button',e=>e.length))===2,'parents page has a child switch');
await B.click('#pkids button[data-k="k0"]');ok(await B.evaluate(()=>S.name==="Sara")&&await B.$eval('.course h2',e=>e.textContent==="Sara"),'switch shows Sara on parents page');
await B.screenshot({path:'build/shots3/32-parents-kids.png'});
/* delete Omar: needs two taps */
await B.click('#who');await B.click(`.kid[data-k="${oid}"]`);await B.click('#prof');
await B.click('#wdel');ok(await B.evaluate(()=>!!PROF.kids[S.id]),'first tap does not delete');
await B.click('#wdel');await B.waitForTimeout(1800);
ok(await B.evaluate(id=>!PROF.kids[id]&&!!PROF.gone[id]&&S.name==="Sara",oid),'Omar deleted, back to Sara');
ok(store['kid-'+oid]&&store['kid-'+oid].gone,'deletion stored in account');
const C=await mk(null);ok(await C.evaluate(id=>Object.keys(PROF.kids).join()==="k0"&&S.name==="Sara"&&!!PROF.gone[id],oid),'third device: only Sara, Omar stays deleted');
/* no account at all (GitHub Pages): profiles still work in the browser */
const D=await mk(null,false);await D.fill('#nm','Lina');await D.click('#gr button[data-g="5"]');await D.click('#go');
await D.click('#who');await D.click('#knew');await D.fill('#nm','Adam');await D.click('#gr button[data-g="8"]');await D.click('#go');
await D.reload();await D.waitForTimeout(1500);ok((await kids(D)).sort().join()==="Adam,Lina",'offline: picker after reload');
await D.click('#langs button[data-l="ar"]');await D.screenshot({path:'build/shots3/33-who-ar.png'});
for(const p of pages)ok(!p.errs.length,'no page errors '+p.errs.join('|'));
await b.close()})();
