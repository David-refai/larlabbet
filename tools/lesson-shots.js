// usage: PW=... node r5.js <dir> <lang> <id,id,...>   -> screenshots in <dir>/shots/, console summary
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const [DIR,LANG,IDL]=process.argv.slice(2),IDS=IDL.split(','),OUT=DIR+'/shots';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1100},reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
await p.goto('file://'+process.cwd()+'/'+DIR+'/test.html');await p.waitForTimeout(800);
await p.click(`#langs button[data-l="${LANG}"]`);await p.click('#gr button[data-g="5"]');await p.click('#go');await p.waitForTimeout(300);
await p.evaluate(()=>{S.places={5:{skipped:true}};save();map()});await p.screenshot({path:`${OUT}/${LANG}-map.png`,fullPage:true});
for(const id of IDS){if(!(await p.$(`.card[data-l="${id}"]`))){console.log('MISSING card',id);continue}
 await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(300);const n=await p.$$eval('#prog i',x=>x.length)-1;
 for(let k=0;k<n;k++){await p.waitForFunction(()=>!document.querySelector('#next').disabled,{timeout:20000});await p.waitForTimeout(120);
  await (await p.$('#stage')).screenshot({path:`${OUT}/${LANG}-${id}-s${k}.png`});
  console.log(id,'scene',k,':',(await p.textContent('#say')).slice(0,150));
  if(k===0){await p.click('#help');await p.waitForTimeout(300);let h=0;while(true){await (await p.$('#stage')).screenshot({path:`${OUT}/${LANG}-${id}-help${h}.png`});console.log(id,'help',h,':',(await p.textContent('#say')).slice(0,150));const m=await p.$('#hmore');if(!m)break;await m.click();await p.waitForTimeout(300);h++}
   await p.click('#hback');await p.waitForTimeout(300);await p.waitForFunction(()=>!document.querySelector('#next').disabled,{timeout:20000})}
  await p.click('#next')}
 await p.waitForTimeout(300);
 for(let lv=0;lv<3;lv++)for(let r=0;r<2;r++){
  const info=await p.evaluate(async([id,lv])=>{const Ls=LESSONS.find(l=>l.id===id),g=Ls.gen(lv),wb=active.wb;wb.cancel();wb.clear();await wb.run(g.q,true);window.__g=g;
    return{kind:g.kind,ans:g.ans,show:g.show!=null?L(g.show):null,opts:g.opts?g.opts.map(L):null,hint:g.hint?L(g.hint.say):null,texts:g.q.filter(a=>a.t==="text").map(a=>a.s).join(" | ")}},[id,lv]);
  await (await p.$('#stage')).screenshot({path:`${OUT}/${LANG}-${id}-g${lv}${r}q.png`});
  if(r===0){await p.evaluate(async()=>{const g=window.__g,wb=active.wb;if(g.hint&&g.hint.draw.length)await wb.run(g.hint.draw,true)});await (await p.$('#stage')).screenshot({path:`${OUT}/${LANG}-${id}-g${lv}hint.png`});
    await p.evaluate(async()=>{const g=window.__g,wb=active.wb;wb.clear();await wb.run(g.q,true)})}
  await p.evaluate(async()=>{const g=window.__g;await active.wb.run(g.sol,true)});
  await (await p.$('#stage')).screenshot({path:`${OUT}/${LANG}-${id}-g${lv}${r}s.png`});
  console.log(id,'level',lv,JSON.stringify(info));}
 await p.click('#back');await p.waitForTimeout(200)}
console.log('errors',errs);await b.close()})();
