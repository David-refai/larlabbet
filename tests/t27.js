// "Utforska kroppen": the body explorer on the Biologi tab. Layers, tapping an organ, isolating it
// (the viewBox zooms), the heart, lungs and brain detail views with labels and flows (still under
// reduced motion), the other organs' info cards, one screen without scrolling, and no page errors.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/explorer';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
 const still=rm==='reduce',T=still?150:1000;
 const noScroll=async n=>{const s=await p.evaluate(()=>({h:document.documentElement.scrollHeight,w:document.documentElement.scrollWidth,ih:innerHeight,iw:innerWidth}));
  ok(s.h<=s.ih+1&&s.w<=s.iw+1,`${tag} ${n}: one screen, no page scroll ${JSON.stringify(s)}`)};

 /* the button is on the Biologi tab only */
 ok(!(await p.$('#texplore')),tag+' no explorer button on the Matte tab');
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(200);
 ok(!!(await p.$('#texplore')),tag+' Biologi tab has "Utforska kroppen"');
 ok((await p.textContent('#texplore')).includes('Utforska kroppen'),tag+' button text');
 for(const g of [5,6]){await p.evaluate(g=>{S.grade=g;map()},g);await p.waitForTimeout(150);
  await p.click('.tab[data-t="bio"]').catch(()=>{});ok(!!(await p.$('#texplore')),tag+` button also for Åk ${g}`)}
 await p.evaluate(()=>{S.grade=4;map()});await p.waitForTimeout(150);
 await p.click('#texplore');await p.waitForTimeout(400);
 ok(!!(await p.$('.xpl .xstage svg.xbody')),tag+' the explorer screen opens with the body');
 await noScroll('stage 1 Kroppen');
 const layerOn=async l=>p.evaluate(l=>[...document.querySelectorAll(`.xbody .xl[data-layer="${l}"]`)].map(g=>g.dataset.on+':'+getComputedStyle(g).opacity).join(','),l);
 ok((await layerOn('skin')).startsWith('1:1'),tag+' stage 1: the skin shows '+await layerOn('skin'));
 ok(await p.$eval('.xsteps button[data-s="body"]',e=>e.getAttribute('aria-current')==='step'),tag+' stepper on Kroppen');
 const aria=await p.$$eval('.xside .xchip',e=>e.map(x=>x.getAttribute('aria-pressed')+'|'+x.getAttribute('aria-label')));
 ok(aria.length===6&&aria.every(a=>/^(true|false)\|Visa eller dölj /.test(a)),tag+' layer buttons have aria-pressed and aria-label');
 await p.screenshot({path:`${D}/t27-${tag}-1-body.png`});

 /* stage 2: inside, layers */
 await p.click('#xlook');await p.waitForTimeout(T);
 ok((await layerOn('skin')).startsWith('0:0')&&(await layerOn('organs')).startsWith('1:1'),tag+' stage 2: skin faded, organs show');
 ok(await p.$eval('.xchip[data-layer="skin"]',e=>e.getAttribute('aria-pressed'))==='false',tag+' skin button not pressed');
 ok((await layerOn('skeleton')).split(',').every(x=>x.startsWith('0')),tag+' skeleton hidden at first');
 await p.click('.xchip[data-layer="skeleton"]');await p.waitForTimeout(T);
 ok((await layerOn('skeleton')).split(',').every(x=>x.startsWith('1')&&+x.split(':')[1]>.5),tag+' skeleton shows after toggling '+await layerOn('skeleton'));
 ok(await p.$eval('.xchip[data-layer="skeleton"]',e=>e.getAttribute('aria-pressed'))==='true',tag+' skeleton button pressed');
 for(const l of ['muscles','vessels','nerves'])await p.click(`.xchip[data-layer="${l}"]`);
 await p.waitForTimeout(T);
 for(const l of ['muscles','vessels','nerves'])ok((await layerOn(l)).startsWith('1:'),tag+` ${l} show`);
 await p.screenshot({path:`${D}/t27-${tag}-2-all.png`});await noScroll('all layers');
 for(const l of ['skeleton','muscles','vessels','nerves'])await p.click(`.xchip[data-layer="${l}"]`);
 await p.waitForTimeout(T);
 ok((await layerOn('nerves')).startsWith('0:0')&&(await layerOn('muscles')).startsWith('0:0'),tag+' layers hide again');

 /* anatomy: heart and stomach on the viewer's right, liver on the viewer's left */
 const cx=await p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.xbody .xorg')].map(g=>{const b=g.getBBox();return[g.dataset.id,Math.round(b.x+b.width/2)]})));
 ok(cx.heart>200&&cx.stomach>200&&cx.liver<200,tag+' heart and stomach on the viewer\'s right, liver on the left '+JSON.stringify(cx));
 ok(Object.keys(cx).length===8,tag+' 8 organs drawn');

 /* stage 3: tap the heart */
 await p.click('.xbody .xorg[data-id="heart"]',{force:true});await p.waitForTimeout(300);
 ok((await p.textContent('#xname')).includes('Hjärtat'),tag+' tapping the heart shows its card');
 ok((await p.textContent('#xtext')).includes('pumpar blod'),tag+' with a Swedish sentence');
 ok(await p.$eval('.xbody .xorg[data-id="heart"]',e=>e.classList.contains('sel')),tag+' the heart glows');
 const btns=await p.$$eval('.xbtns button',e=>e.map(x=>x.textContent.trim()));
 ok(btns.join('|').startsWith('Isolera|Dölj|Mer'),tag+' buttons '+btns.join(','));
 ok(await p.$eval('.xsteps button[data-s="organ"]',e=>e.getAttribute('aria-current')==='step'),tag+' stepper on Organ');
 const vb0=await p.getAttribute('.xbody','viewBox');
 await p.click('#xiso');await p.waitForTimeout(still?60:1000);
 const vb1=await p.getAttribute('.xbody','viewBox');
 ok(vb0!==vb1&&+vb1.split(' ')[2]<+vb0.split(' ')[2],tag+` Isolera zooms the viewBox ${vb0} → ${vb1}`);
 ok(await p.$eval('.xbody .xorg[data-id="liver"]',e=>+getComputedStyle(e).opacity<.3),tag+' the rest of the body fades back');
 await p.screenshot({path:`${D}/t27-${tag}-3-heart-iso.png`});await noScroll('isolated heart');

 /* stage 4: the heart opened up */
 await p.click('#xmorebtn');await p.waitForTimeout(still?150:900);
 ok(await p.$eval('.xstage',e=>e.classList.contains('indetail')),tag+' "Mer" opens the heart detail');
 const tabs=await p.$$eval('.xside [role=tab]',e=>e.map(x=>x.textContent));ok(tabs.join()==='Översikt,Kammare,Klaffar,Blodflöde',tag+' heart tabs '+tabs);
 const labs=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
 for(const n of ['Höger förmak','Vänster förmak','Höger kammare','Vänster kammare','Aorta','Lungartär','Hålvener','Klaffar'])ok(labs.includes(n),tag+' heart label '+n);
 /* the left side of the heart is on the viewer's right */
 const side=await p.evaluate(()=>{const c=id=>{const r=document.querySelector(`.xdet path[data-part="${id}"]`).getBBox();return r.x+r.width/2};return{vk:c('vk'),hk:c('hk'),vf:c('vf'),hf:c('hf')}});
 ok(side.vk>side.hk&&side.vf>side.hf,tag+' left chambers on the viewer\'s right '+JSON.stringify(side));
 await p.click('.xlab[data-part="vk"] text');await p.waitForTimeout(150);
 ok((await p.textContent('#xname')).includes('Vänster kammare'),tag+' tapping a label shows that part');
 await p.click('.xchip[data-tab="klaffar"]');await p.waitForTimeout(200);
 ok((await p.$$eval('.xdet .xlab',e=>e.length))===4,tag+' four valves labelled');
 await p.click('.xchip[data-tab="flode"]');await p.waitForTimeout(300);
 const fl=await p.evaluate(()=>({m:document.querySelectorAll('.xdet animateMotion').length,d:document.querySelectorAll('.xdet .xdot').length,red:document.querySelectorAll('.xdet .xdot[fill*="dred"]').length,blue:document.querySelectorAll('.xdet .xdot[fill*="dblue"]').length}));
 const pos=async()=>p.evaluate(()=>[...document.querySelectorAll('.xdet .xdot')].slice(0,4).map(c=>{const r=c.getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y)}).join(' '));
 ok(!!(await p.$('#xlegend')),tag+' the flow has a colour legend');
 if(still){ok(fl.m===0&&fl.d>=20&&fl.red>0&&fl.blue>0,tag+' reduced motion: still red and blue dots, no animateMotion '+JSON.stringify(fl));
  const a=await pos();await p.waitForTimeout(500);ok(a===await pos(),tag+' reduced motion: the dots stay put');
  ok(!(await p.$('#xplay')),tag+' reduced motion: no play button');
  ok(await p.$eval('.xdet .xbeat',e=>getComputedStyle(e).animationName==='none'),tag+' reduced motion: the heart does not beat')}
 else{ok(fl.m>0&&fl.m===fl.d&&fl.red>0&&fl.blue>0,tag+' red and blue dots move with animateMotion '+JSON.stringify(fl));
  const a=await pos();await p.waitForTimeout(500);const c=await pos();ok(a!==c,tag+' the blood flows: '+a+' → '+c);
  await p.click('#xplay');await p.waitForTimeout(100);ok(await p.$eval('#xplay',e=>e.getAttribute('aria-pressed'))==='false',tag+' pause button pressed');
  const e1=await pos();await p.waitForTimeout(400);ok(e1===await pos(),tag+' paused: the dots stop');
  await p.click('#xplay');await p.waitForTimeout(100)}
 await p.screenshot({path:`${D}/t27-${tag}-4-heart-flow.png`});await noScroll('heart detail');

 /* the lungs and the brain */
 const openDetail=async id=>{await p.click('#xback');await p.click('.xsteps button[data-s="inside"]');await p.waitForTimeout(still?100:800);
  await p.click(`.xchip[data-organ="${id}"]`);await p.click('#xmorebtn');await p.waitForTimeout(still?150:900)};
 await openDetail('lungs');
 let L=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
 ok(['Luftstrupe','Luftrör','Lungblåsor'].every(n=>L.includes(n))&&await p.$eval('.xstage',e=>e.classList.contains('indetail')),tag+' lung detail: '+L.join(', '));
 await p.click('.xchip[data-tab="luft"]');await p.waitForTimeout(300);
 const air=await p.evaluate(()=>({m:document.querySelectorAll('.xdet animateMotion').length,d:document.querySelectorAll('.xdet .xdot').length}));
 ok(still?air.m===0&&air.d>0:air.m>0,tag+' air flows in the airways '+JSON.stringify(air));
 await p.screenshot({path:`${D}/t27-${tag}-4-lungs.png`});
 await openDetail('brain');
 L=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
 ok(['Storhjärna','Lillhjärna','Hjärnstam'].every(n=>L.includes(n)),tag+' brain detail: '+L.join(', '));
 await p.screenshot({path:`${D}/t27-${tag}-4-brain.png`});await noScroll('brain detail');

 /* the other organs: info card and isolate, no detail view */
 await p.click('#xback');await p.click('.xsteps button[data-s="inside"]');await p.waitForTimeout(still?100:800);
 for(const [id,name] of [['stomach','Magsäcken'],['liver','Levern'],['intestines','Tarmarna'],['kidneys','Njurarna'],['bladder','Urinblåsan']]){
  await p.click(`.xchip[data-organ="${id}"]`);await p.waitForTimeout(100);
  const n=await p.textContent('#xname'),v0=await p.getAttribute('.xbody','viewBox');
  await p.click('#xiso');await p.waitForTimeout(still?60:900);const v1=await p.getAttribute('.xbody','viewBox');
  await p.click('#xmorebtn');await p.waitForTimeout(100);
  ok(n.includes(name)&&v0!==v1&&!!(await p.$('.xmore'))&&!(await p.$eval('.xstage',e=>e.classList.contains('indetail'))),tag+` ${name}: card, isolate, "Mer" fact without detail view`);
  await p.click('#xiso');await p.click('.xsteps button[data-s="inside"]');await p.waitForTimeout(still?60:800)}
 /* Dölj hides an organ, and it comes back */
 await p.click('.xchip[data-organ="stomach"]');await p.click('#xhide');await p.waitForTimeout(still?100:800);
 ok(await p.$eval('.xbody .xorg[data-id="stomach"]',e=>getComputedStyle(e).opacity==='0'),tag+' "Dölj" hides the stomach');
 await p.click('#xshowall');await p.waitForTimeout(still?100:800);
 ok(await p.$eval('.xbody .xorg[data-id="stomach"]',e=>getComputedStyle(e).opacity==='1'),tag+' and it comes back');
 /* the translation setting shows the English text under the Swedish */
 await p.evaluate(()=>setLang('en'));await p.waitForTimeout(300);
 await p.click('.xchip[data-organ="heart"]');await p.waitForTimeout(100);
 ok((await p.textContent('#xtext')).includes('pumps blood'),tag+' translation under the info text');
 await p.evaluate(()=>setLang('sv'));await p.waitForTimeout(300);
 /* back to the map */
 await p.click('#back');await p.waitForTimeout(300);
 ok(!!(await p.$('.tabs'))&&!(await p.$('.xpl')),tag+' back to the lesson map');
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
