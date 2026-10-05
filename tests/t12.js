const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/shots4';fs.mkdirSync(D,{recursive:true});
const R1={steps:[{say:"Tänk dig 48 godisar som ska delas lika på 8 påsar.",board:[{k:"title",s:"48 godisar, 8 påsar"},{k:"groups",n:6,each:8},{k:"note",s:"Hur många hamnar i varje påse?"}]},
 {say:"Räkna gånger-tabellen: 8 · 5 = 40, 8 · 6 = ?",board:[{k:"eq",s:"8 · 5 = 40"},{k:"line",from:0,to:48,step:8,marks:[40],jumps:[[0,8],[8,16],[16,24],[24,32],[32,40]]}]},
 {say:"Nästan där! Du klarar sista hoppet själv.",board:[{k:"array",rows:5,cols:8},{k:"eq",s:"8 · ? = 48",c:"g"}]}]};
const R2={steps:[{say:"Pizza!",board:[{k:"frac",n:3,d:4},{k:"bar",parts:4,shade:3}]},{say:"Blocks and clock",board:[{k:"blocks",tens:4,ones:7},{k:"clock",h:7,m:15},{k:"note",s:"dropped: too tall"}]},{say:"bad items",board:[{k:"hack",s:"x"},{k:"eq",s:"<script>alert(1)</script> very long text that goes on"}]}]};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1100},reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 const prompts=[];await p.exposeFunction('__prompt',(t,o)=>prompts.push([t,o]));
 await p.addInitScript(([r1,r2])=>{let n=0;const s=async()=>({text:""});s.json=async(t,o)=>{window.__prompt(t,JSON.stringify(o));await new Promise(r=>setTimeout(r,300));return n++%2?r2:r1};
   window.claude={use:async k=>k==="sample"?s:null}},[R1,R2]);
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
 await p.click('#langs button[data-l="sv"]');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(200);
 await p.evaluate(()=>{S.place={skipped:true};save()});await p.click('#home');
 await p.click('.card[data-l="div"]');await p.waitForTimeout(300);
 console.log('ai button visible in scene:',await p.isVisible('#ai'));
 await p.click('#ai');await p.waitForTimeout(100);await p.screenshot({path:`${D}/1-thinking.png`});await p.waitForTimeout(500);
 for(let h=0;h<3;h++){await (await p.$('#stage')).screenshot({path:`${D}/2-scene-step${h}.png`});if(h===0)await p.screenshot({path:`${D}/2-full.png`});const m=await p.$('#aimore');if(m){await m.click();await p.waitForTimeout(300)}}
 await p.click('#aiagain');await p.waitForTimeout(600);
 for(let h=0;h<3;h++){await (await p.$('#stage')).screenshot({path:`${D}/3-items-step${h}.png`});const m=await p.$('#aimore');if(m){await m.click();await p.waitForTimeout(300)}}
 await p.screenshot({path:`${D}/3-full-end.png`});
 await p.click('#aiask');await p.fill('#aiq','varför blir det 6?');await p.click('#aisend');await p.waitForTimeout(600);
 await p.click('#aiback');await p.waitForTimeout(300);console.log('back in scene: next visible',await p.isVisible('#next'),'ai visible',await p.isVisible('#ai'));
 for(let k=0;k<12&&!(await p.$('#chk'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(120)}
 await p.click('#ai');await p.waitForTimeout(600);await p.click('#aiback');await p.waitForTimeout(300);
 console.log('back in practice: chk visible',await p.isVisible('#chk'),'quiz hidden',await p.$eval('#quiz',e=>e.hidden));await p.screenshot({path:`${D}/4-practice-back.png`});
 await p.fill('#an','5');await p.click('#chk');await p.waitForTimeout(200);await p.click('#ai');await p.waitForTimeout(600);await p.click('#aiback');await p.waitForTimeout(300);
 console.log('after judged: nx visible',await p.isVisible('#nx'));
 prompts.forEach(([t,o],i)=>{console.log(`--- prompt ${i} opts ${o}\n`+t.split('\n').filter(l=>/Lesson|problem|answer|teacher|board shows|already|wrote|SECRET|answered/.test(l)).join('\n'))});
 console.log('errors',errs);await b.close()})();
