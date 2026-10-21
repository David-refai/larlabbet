// "Utforska kroppen": the body explorer on the Biologi tab, 2D stage (the painted pictures of
// explorer/imageRenderer.ts). Layers, tapping an organ, isolating it (the viewBox zooms, then the
// organ's own picture), the heart, lungs and brain detail pictures with labels and flows (still under
// reduced motion), the other organs' parts, one layer at a time (David 2026-10-21: the pictures never
// lie on top of each other), tapping an organ zooms in and opens its parts, tapping a bone or a muscle
// zooms to it and explains it, one screen without scrolling, and no page errors.
// Last: when a picture does not load, the drawn SVG body (svgRenderer.ts) takes over.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/explorer';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();
for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 /* this test checks the 2D (SVG) explorer: the 3D one is switched off (t28 tests it) */
 await p.addInitScript(()=>{window.NO3D=true});
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
 ok(!!(await p.$('.xstage.ximg')),tag+' the painted pictures are used');
 const pics=await p.evaluate(()=>Promise.all([...new Set([...document.querySelectorAll('.xbody image')].map(i=>i.getAttribute('href')).filter(h=>/^body\//.test(h)))]
  .map(h=>new Promise(r=>{const i=new Image();i.onload=()=>r(h+':'+i.naturalWidth);i.onerror=()=>r(h+':ERR');i.src=h}))));
 ok(pics.length===7&&pics.every(x=>x.endsWith(':900')),tag+' the 7 body pictures load (900 px) '+pics.join(' '));
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
 /* one layer at a time: each picture is a whole body, they never lie on top of each other */
 for(const l of ['muscles','vessels','nerves']){await p.click(`.xchip[data-layer="${l}"]`);await p.waitForTimeout(T);
  const on=await p.$$eval('.xbody .xl',e=>e.filter(g=>g.dataset.on==='1').map(g=>g.dataset.layer));
  ok(on.join()===l&&(await layerOn(l)).startsWith('1:1'),tag+` ${l} alone, fully shown (${on})`);
  ok((await p.$$eval('.xside .xchip[aria-pressed=true]',e=>e.map(x=>x.dataset.layer))).join()===l,tag+` only ${l} pressed`)}
 await p.screenshot({path:`${D}/t27-${tag}-2-nerves.png`});await noScroll('nerves');
 /* bones: tap one, the body zooms to it and the panel explains it */
 await p.click('.xchip[data-layer="skeleton"]');await p.waitForTimeout(T);
 ok((await p.$$eval('#xbits .xchip',e=>e.length))===12,tag+' 12 bones to choose');
 const sv0=await p.getAttribute('.xbody','viewBox');
 /* tap the right thigh bone itself (the middle of its two areas lies between the legs) */
 {const r=await p.$eval('.xbody .xbit[data-id="larben"] .xhit',e=>{const m=e.getScreenCTM(),pt=new DOMPoint(393,630).matrixTransform(m);return[pt.x,pt.y]});await p.mouse.click(r[0],r[1])}await p.waitForTimeout(T);
 const sv1=await p.getAttribute('.xbody','viewBox');
 ok((await p.textContent('#xname')).includes('Lårbenet')&&(await p.textContent('#xtext')).includes('längsta'),tag+' tapping the thigh bone explains it');
 ok(+sv1.split(' ')[2]<+sv0.split(' ')[2]/2,tag+` and zooms to it ${sv0} → ${sv1}`);
 ok(await p.$eval('.xbody .xbit[data-id="larben"]',e=>e.classList.contains('sel'))&&(await p.textContent('.xbody .xlabel')).includes('Lårbenet'),tag+' the bone is ringed and named');
 await p.screenshot({path:`${D}/t27-${tag}-2-femur.png`});await noScroll('femur');
 await p.click('#xbitback');await p.waitForTimeout(T);
 ok(await p.getAttribute('.xbody','viewBox')===sv0,tag+' back to the whole skeleton');
 await p.click('.xchip[data-layer="muscles"]');await p.waitForTimeout(T);
 await p.click('#xbits .xchip[data-bit="biceps"]');await p.waitForTimeout(T);
 ok((await p.textContent('#xname')).includes('Biceps')&&(await p.textContent('#xtext')).includes('triceps'),tag+' muscles: biceps explained');
 await p.screenshot({path:`${D}/t27-${tag}-2-biceps.png`});
 await p.click('.xchip[data-layer="organs"]');await p.waitForTimeout(T);
 ok((await layerOn('muscles')).startsWith('0:0')&&(await layerOn('organs')).startsWith('1:1')&&!(await p.$('.xbody .xlabel text')),tag+' organs: the muscles go away, no bone label');

 /* anatomy: heart and stomach on the viewer's right, liver on the viewer's left */
 const cx=await p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.xbody .xorg .xhit')].map(g=>{const b=g.getBBox();return[g.parentNode.dataset.id,Math.round(b.x+b.width/2)]})));
 /* the middle of the 900 px pictures */
 ok(cx.heart>452&&cx.stomach>452&&cx.liver<452,tag+' heart and stomach on the viewer\'s right, liver on the left '+JSON.stringify(cx));
 ok(Object.keys(cx).length===8,tag+' 8 organs drawn');

 /* stage 3+4: tap the heart: the body zooms to it, then its parts open */
 const vbA=await p.getAttribute('.xbody','viewBox');
 await p.click('.xbody .xorg[data-id="heart"]',{force:true});await p.waitForTimeout(still?60:300);
 if(!still){const vz=await p.getAttribute('.xbody','viewBox');ok(vz!==vbA&&!(await p.$eval('.xstage',e=>e.classList.contains('indetail'))),tag+' tapping the heart zooms in first '+vz)}
 await p.waitForTimeout(still?150:900);
 ok(await p.$eval('.xstage',e=>e.classList.contains('indetail'))&&await p.$eval('.xdet image.xdpic',e=>e.getAttribute('href'))==='body/heart-inside.webp',tag+' then the heart opens into its parts');
 await p.click('.xsteps button[data-s="organ"]');await p.waitForTimeout(still?60:300);
 ok((await p.textContent('#xname')).includes('Hjärtat'),tag+' the Organ step shows its card');
 ok((await p.textContent('#xtext')).includes('pumpar blod'),tag+' with a Swedish sentence');
 ok(await p.$eval('.xbody .xorg[data-id="heart"]',e=>e.classList.contains('sel')),tag+' the heart glows');
 const btns=await p.$$eval('.xbtns button',e=>e.map(x=>x.textContent.trim()));
 ok(btns.join('|').startsWith('Hela kroppen|Dölj|Mer'),tag+' buttons '+btns.join(','));
 ok(await p.$eval('.xsteps button[data-s="organ"]',e=>e.getAttribute('aria-current')==='step'),tag+' stepper on Organ');
 const vb0=vbA;
 await p.waitForTimeout(still?60:1000);
 const vb1=await p.getAttribute('.xbody','viewBox');
 ok(vb0!==vb1&&+vb1.split(' ')[2]<+vb0.split(' ')[2],tag+` zoomed viewBox ${vb0} → ${vb1}`);
 ok(await p.$eval('.xbody .xorg[data-id="liver"]',e=>+getComputedStyle(e).opacity<.3),tag+' the rest of the body fades back');
 await p.waitForFunction(()=>+getComputedStyle(document.querySelector('.xiso')).opacity>.9,null,{timeout:4000}).catch(()=>{});
 const card=await p.evaluate(()=>{const i=document.querySelector('.xiso img');return{on:document.querySelector('.xstage').classList.contains('isocard'),src:i.getAttribute('src'),w:i.naturalWidth,
  name:document.querySelector('.xisoname').textContent,op:getComputedStyle(document.querySelector('.xiso')).opacity}});
 ok(card.on&&card.src==='body/organ-heart.webp'&&card.w>0&&card.name==='Hjärtat'&&+card.op>.9,tag+' then the heart\'s own picture shows large '+JSON.stringify(card));
 await p.screenshot({path:`${D}/t27-${tag}-3-heart-iso.png`});await noScroll('isolated heart');

 /* stage 4: the heart opened up */
 await p.click('#xmorebtn');await p.waitForTimeout(still?150:900);
 ok(await p.$eval('.xstage',e=>e.classList.contains('indetail')),tag+' "Mer" opens the heart detail');
 ok(await p.$eval('.xdet image.xdpic',e=>e.getAttribute('href'))==='body/heart-inside.webp',tag+' the heart detail is the painted cutaway');
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
 const openDetail=async id=>{await p.click('#xback');await p.waitForTimeout(still?100:800);
  await p.click(`.xchip[data-organ="${id}"]`);await p.waitForTimeout(still?150:1700)};
 await openDetail('lungs');
 let L=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
 ok(['Luftstrupe','Luftrör','Lungblåsor'].every(n=>L.includes(n))&&await p.$eval('.xstage',e=>e.classList.contains('indetail')),tag+' lung detail: '+L.join(', '));
 await p.click('.xchip[data-tab="luft"]');await p.waitForTimeout(300);
 const air=await p.evaluate(()=>({m:document.querySelectorAll('.xdet animateMotion').length,d:document.querySelectorAll('.xdet .xdot').length}));
 ok(still?air.m===0&&air.d>0:air.m>0,tag+' air flows in the airways '+JSON.stringify(air));
 await p.click('.xchip[data-tab="blasor"]');await p.waitForTimeout(200);
 ok(await p.$eval('.xdet image.xdpic',e=>e.getAttribute('href'))==='body/alveoli.webp'&&(await p.$$eval('.xdet .xlab',e=>e.length))===3,tag+' the air sacs tab shows the alveoli picture with 3 labels');
 await p.screenshot({path:`${D}/t27-${tag}-4-lungs.png`});
 await openDetail('brain');
 L=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
 ok(['Storhjärna','Lillhjärna','Hjärnstam'].every(n=>L.includes(n)),tag+' brain detail: '+L.join(', '));
 await p.screenshot({path:`${D}/t27-${tag}-4-brain.png`});await noScroll('brain detail');

 /* the other organs open into their own pictures with their parts */
 for(const [id,name,parts] of [['stomach','Magsäcken',['Matstrupe','Nedre magmunnen']],['liver','Levern',['Gallblåsa']],['intestines','Tarmarna',['Tunntarmen','Tjocktarmen']],['kidneys','Njurarna',['Njurartär','Urinledare']],['bladder','Urinblåsan',['Urinrör']]]){
  await p.click('#xback');await p.waitForTimeout(still?100:800);
  await p.click(`.xchip[data-organ="${id}"]`);await p.waitForTimeout(still?150:1700);
  const L=await p.$$eval('.xdet .xlab',e=>e.map(x=>x.getAttribute('aria-label')));
  ok(await p.$eval('.xdet image.xdpic',e=>e.getAttribute('href'))===`body/organ-${id}.webp`&&parts.every(n=>L.includes(n))&&(await p.textContent('#xinfo .label')).includes(name),tag+` ${name}: its parts ${L.join(', ')}`);
  await p.click('.xchip[data-part]');await p.waitForTimeout(100);
  ok((await p.textContent('#xtext')).length>20,tag+` ${name}: a part explains itself`);
  if(id==='stomach'){await p.screenshot({path:`${D}/t27-${tag}-4-stomach.png`});await noScroll('stomach parts')}}
 await p.click('#xback');await p.waitForTimeout(still?100:800);
 /* Dölj hides an organ, and it comes back */
 await p.click('.xchip[data-organ="stomach"]');await p.waitForTimeout(still?150:1700);
 await p.click('.xsteps button[data-s="organ"]');await p.click('#xhide');await p.waitForTimeout(still?100:800);
 ok(await p.$eval('.xbody .xorg[data-id="stomach"]',e=>getComputedStyle(e).opacity==='0'),tag+' "Dölj" hides the stomach');
 await p.click('#xshowall');await p.waitForTimeout(still?100:800);
 ok(await p.$eval('.xbody .xorg[data-id="stomach"]',e=>getComputedStyle(e).opacity==='1'),tag+' and it comes back');
 /* the translation setting shows the English text under the Swedish */
 await p.evaluate(()=>setLang('en'));await p.waitForTimeout(300);
 await p.click('.xchip[data-organ="heart"]');await p.waitForTimeout(still?150:1700);await p.click('.xsteps button[data-s="organ"]');await p.waitForTimeout(100);
 ok((await p.textContent('#xtext')).includes('pumps blood'),tag+' translation under the info text');
 await p.evaluate(()=>setLang('sv'));await p.waitForTimeout(300);
 /* back to the map */
 await p.click('#back');await p.waitForTimeout(300);
 ok(!!(await p.$('.tabs'))&&!(await p.$('.xpl')),tag+' back to the lesson map');
 ok(!p.errs.length,tag+' no page errors '+p.errs.join(' | '));await p.close()}

/* a picture that does not load: the drawn SVG body takes over */
{const p=await b.newPage({viewport:{width:1280,height:800}});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.addInitScript(()=>{window.NO3D=true});
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/jsdelivr/,r=>r.abort());
 await p.route(/body\/organs-front\.webp/,r=>r.abort());
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(200);await p.click('#texplore');await p.waitForTimeout(300);
 await p.click('#xlook');await p.waitForTimeout(800);
 const fb=await p.evaluate(()=>({img:!!document.querySelector('.xstage.ximg'),art:document.querySelectorAll('.xbody .xorg').length,pics:document.querySelectorAll('.xbody image').length}));
 ok(!fb.img&&fb.art===8&&fb.pics===0,'fallback: without organs-front.webp the drawn body shows '+JSON.stringify(fb));
 await p.click('.xchip[data-organ="heart"]');await p.waitForTimeout(1700);
 ok(!!(await p.$('.xdet path[data-part="vk"]'))&&!(await p.$('.xdet image')),'fallback: the drawn heart detail');
 ok(!p.errs.length,'fallback: no page errors '+p.errs.join(' | '));await p.close()}
await b.close()})();
