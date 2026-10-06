const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1100},reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);await p.screenshot({path:'build/v6-map.png',fullPage:true});
await p.click('.card[data-l="time"]');await p.waitForTimeout(600);
const step=()=>p.$$eval('#prog i.now',x=>x.length?[...document.querySelectorAll('#prog i')].indexOf(x[0]):-1);
await p.keyboard.press('ArrowRight');await p.waitForTimeout(400);await p.keyboard.press('ArrowRight');await p.waitForTimeout(400);console.log('after 2x right, step',await step());
await p.keyboard.press('ArrowLeft');await p.waitForTimeout(400);console.log('after left, step',await step());
await p.waitForTimeout(500);await p.screenshot({path:'build/v6-lesson.png'});
// go to practice with arrow keys
for(let k=0;k<8;k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(300)}
console.log('practice input present',!!await p.$('#an'),'pair',!!await p.$('.pairin'));
await p.evaluate(()=>{});
// answer the clock with pair inputs: read the true answer from the board is hard; just type 1:00 and check the verdict UI
await p.fill('#an','1');await p.fill('#ad','00');await p.click('#chk');await p.waitForTimeout(500);console.log('verdict:',await p.textContent('#ctrl'));
await p.screenshot({path:'build/v6-practice.png'});
await p.keyboard.press('ArrowRight');await p.waitForTimeout(400);console.log('next problem via arrow, input present:',!!await p.$('#an'));
await p.click('#back');await p.click('.card[data-l="shapes"]');await p.waitForTimeout(300);
for(let k=0;k<8;k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(250)}
const ch=await p.$$('.ch');console.log('choice buttons',ch.length,'input',!!await p.$('#an'));
if(ch.length){await ch[1].click();await p.waitForTimeout(300);console.log('choice verdict:',await p.textContent('#ctrl'))}
await p.click('#back');await p.click('.card[data-l="div"]');await p.waitForTimeout(300);
await p.evaluate(()=>{S.lessons.div={stars:0,level:2};save()});await p.click('#back');await p.click('.card[data-l="div"]');
for(let k=0;k<8;k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(250)}
console.log('div pair',!!await p.$('.pairin'),await p.$eval('.pairin',e=>e.textContent).catch(()=>null));
await p.click('#back');await p.click('.card[data-l="dec"]');await p.evaluate(()=>{S.lessons.dec={stars:0,level:1};save()});await p.click('#back');await p.click('.card[data-l="dec"]');
for(let k=0;k<8;k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(250)}
const qtext=await p.evaluate(()=>[...document.querySelectorAll('#stage text')].map(t=>t.textContent).join('|'));console.log('dec q',qtext);
const m=qtext.match(/(\d),(\d) \+ (\d),(\d)/);if(m){const v=((+m[1]*10+ +m[2])+(+m[3]*10+ +m[4]))/10;await p.fill('#an',String(v).replace('.',','));await p.click('#chk');await p.waitForTimeout(300);console.log('dec verdict',await p.textContent('#ctrl'))}
console.log('errors',errs);await b.close()})();
